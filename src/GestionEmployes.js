import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, Edit, Trash2, Plus, Users, Search, Filter, AlertCircle } from 'lucide-react';

const GestionEmployes = () => {
  const [employes, setEmployes] = useState([]);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [poste, setPoste] = useState('Gérant');
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPoste, setFilterPoste] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeToDelete, setEmployeToDelete] = useState(null);

  // Récupérer les employés avec gestion d'erreur améliorée
  useEffect(() => {
    const fetchEmployes = async () => {
      setIsLoading(true);
      setDebugInfo('Chargement des employés...');
      
      try {
        // Tentative avec l'API réelle
        const response = await fetch('http://127.0.0.1:8000/api/employes');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setEmployes(data);
        setDebugInfo(`${data.length} employé(s) chargé(s) avec succès`);
        setError('');
      } catch (err) {
        console.error('Erreur API:', err);
        setError(`Erreur de connexion à l'API: ${err.message}`);
        setDebugInfo('Connexion à l\'API échouée - Mode démo activé');
        
        // En cas d'erreur, utiliser des données de test
        const testEmployes = [
          {
            id: 1,
            nom: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            poste: 'Gérant',
            telephone: '+221 77 123 45 67'
          },
          {
            id: 2,
            nom: 'Marie Martin',
            email: 'marie.martin@example.com',
            poste: 'Vendeur',
            telephone: '+221 78 234 56 78'
          }
        ];
        setEmployes(testEmployes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployes();
  }, []);

  // Ajouter ou mettre à jour un employé
  const handleSubmit = async () => {
    if (!nom || !email || !poste) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const employeData = {
      nom,
      email,
      poste,
      telephone,
    };

    try {
      if (isEditing) {
        // Mise à jour
        const response = await fetch(`http://127.0.0.1:8000/api/employes/${currentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeData),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour');
        }

        // Mettre à jour localement
        setEmployes(prev => prev.map(emp => 
          emp.id === currentId ? { ...employeData, id: currentId } : emp
        ));
        
        setIsEditing(false);
        setCurrentId(null);
        setDebugInfo('Employé mis à jour avec succès');
      } else {
        // Ajout
        const response = await fetch('http://127.0.0.1:8000/api/employes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeData),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout');
        }

        const newEmployee = await response.json();
        
        // Ajouter localement
        setEmployes(prev => [...prev, { ...employeData, id: newEmployee.id || Date.now() }]);
        setDebugInfo('Employé ajouté avec succès');
      }

      // Réinitialiser les champs
      setNom('');
      setEmail('');
      setPoste('Gérant');
      setTelephone('');

    } catch (err) {
      console.error('Erreur:', err);
      
      if (!isEditing) {
        // En cas d'erreur, ajouter quand même localement pour le test
        const newEmployee = { ...employeData, id: Date.now() };
        setEmployes(prev => [...prev, newEmployee]);
        setDebugInfo('Ajouté en mode local (API non disponible)');
        
        // Réinitialiser les champs
        setNom('');
        setEmail('');
        setPoste('Gérant');
        setTelephone('');
      } else {
        setError('Erreur lors de l\'opération');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un employé
  const handleDelete = async (id) => {
    setEmployeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!employeToDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/employes/${employeToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Supprimer localement
      setEmployes(prev => prev.filter(employe => employe.id !== employeToDelete));
      setDebugInfo('Employé supprimé avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      // Supprimer quand même localement
      setEmployes(prev => prev.filter(employe => employe.id !== employeToDelete));
      setDebugInfo('Supprimé en mode local (API non disponible)');
    } finally {
      setShowDeleteConfirm(false);
      setEmployeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setEmployeToDelete(null);
  };

  // Modifier un employé
  const handleEdit = (id) => {
    const employeToEdit = employes.find((employe) => employe.id === id);
    if (employeToEdit) {
      setNom(employeToEdit.nom);
      setEmail(employeToEdit.email);
      setPoste(employeToEdit.poste);
      setTelephone(employeToEdit.telephone || '');
      setIsEditing(true);
      setCurrentId(id);
      setDebugInfo(`Modification de l'employé: ${employeToEdit.nom}`);
    }
  };

  // Annuler la modification
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNom('');
    setEmail('');
    setPoste('Gérant');
    setTelephone('');
    setDebugInfo('Modification annulée');
  };

  // Filtrer les employés
  const filteredEmployes = employes.filter(employe => {
    const matchesSearch = employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employe.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPoste === '' || employe.poste === filterPoste;
    return matchesSearch && matchesFilter;
  });

  const getPosteColor = (poste) => {
    switch(poste) {
      case 'Gérant': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Vendeur': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Responsable stock': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header avec animation */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion des Employés
                </h1>
                <p className="text-gray-600 mt-1">Gérez votre équipe efficacement</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-600">
                  {employes.length} employé{employes.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Message de débogage */}
        {debugInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-blue-600 font-medium">{debugInfo}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire d'ajout/modification */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  {isEditing ? 'Modifier l\'employé' : 'Nouvel employé'}
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                      placeholder="Entrez le nom complet"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                      placeholder="exemple@email.com"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Briefcase className="inline h-4 w-4 mr-1" />
                      Poste
                    </label>
                    <select
                      value={poste}
                      onChange={(e) => setPoste(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                    >
                      <option value="Gérant">Gérant</option>
                      <option value="Vendeur">Vendeur</option>
                      <option value="Responsable stock">Responsable stock</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                      placeholder="+221 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Chargement...
                      </div>
                    ) : (
                      isEditing ? 'Mettre à jour' : 'Ajouter'
                    )}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-4 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Liste des employés */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Liste des employés ({filteredEmployes.length})
                </h2>
              </div>

              {/* Barre de recherche et filtres */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un employé..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={filterPoste}
                      onChange={(e) => setFilterPoste(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Tous les postes</option>
                      <option value="Gérant">Gérant</option>
                      <option value="Vendeur">Vendeur</option>
                      <option value="Responsable stock">Responsable stock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tableau des employés */}
              <div className="overflow-x-auto">
                {filteredEmployes.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employé</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Poste</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEmployes.map((employe) => (
                        <tr key={employe.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {employe.nom.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{employe.nom}</div>
                                <div className="text-sm text-gray-500">{employe.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPosteColor(employe.poste)}`}>
                              {employe.poste}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{employe.telephone || 'Non renseigné'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(employe.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                                title="Modifier"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(employe.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterPoste ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter votre premier employé'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Supprimer
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEmployes;