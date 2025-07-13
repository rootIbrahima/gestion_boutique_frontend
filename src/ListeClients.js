import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Loader2,
  Users,
  Filter,
  MoreVertical,
  Eye,
  Star,
  Calendar
} from 'lucide-react';

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    // Récupérer les clients depuis l'API
    axios.get('http://127.0.0.1:8000/api/clients')
      .then(response => {
        setClients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des clients:', error);
        setLoading(false);
      });
  }, []);

  // Gérer la suppression d'un client
  const handleDelete = (id) => {
    setDeleteLoading(id);
    const token = localStorage.getItem('token');

    axios.delete(`http://127.0.0.1:8000/api/clients/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setClients(clients.filter(client => client.id !== id));
      setDeleteLoading(null);
      setShowDeleteModal(false);
      setClientToDelete(null);
    })
    .catch(error => {
      console.error('Erreur lors de la suppression du client:', error);
      setDeleteLoading(null);
      alert('Erreur lors de la suppression du client');
    });
  };

  const confirmDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtrer les clients selon le texte de recherche
  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  // Générer les initiales pour l'avatar
  const getInitials = (nom) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (nom) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-teal-500 to-cyan-600',
      'from-pink-500 to-rose-600',
      'from-yellow-500 to-orange-600'
    ];
    const index = nom.length % colors.length;
    return colors[index];
  };

  // Composant de chargement moderne
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        <p className="text-gray-600 font-medium">Chargement des clients...</p>
      </div>
    </div>
  );

  // Composant d'état vide
  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="relative mx-auto w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full"></div>
        <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
          <Users className="h-12 w-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {search ? 'Aucun résultat trouvé' : 'Aucun client enregistré'}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {search 
          ? `Aucun client ne correspond à "${search}". Essayez avec d'autres termes.`
          : 'Commencez votre aventure en ajoutant votre premier client dès maintenant.'
        }
      </p>
      {!search && (
        <Link 
          to="/ajouter-client"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter votre premier client
        </Link>
      )}
    </div>
  );

  // Modal de confirmation de suppression
  const DeleteModal = () => (
    <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer le client</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{clientToDelete?.nom}</strong> ? 
              Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(clientToDelete?.id)}
                disabled={deleteLoading === clientToDelete?.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deleteLoading === clientToDelete?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Afficher le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec design moderne */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Mes Clients
              </h1>
              <p className="text-gray-600 text-lg">
                {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} 
                {search && ` trouvé${filteredClients.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <Link 
              to="/ajouter-client"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau client
            </Link>
          </div>

          {/* Barre de recherche moderne */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              placeholder="Rechercher un client..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Contenu principal */}
        {filteredClients.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden group">
                <div className="p-6">
                  {/* Avatar et nom */}
                  <div className="flex items-center mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${getAvatarColor(client.nom)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {getInitials(client.nom)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {client.nom}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {client.id}</p>
                    </div>
                  </div>

                  {/* Informations de contact */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">{client.telephone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link 
                      to={`/modifier-client/${client.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Link>
                    <button
                      onClick={() => confirmDelete(client)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de suppression */}
        <DeleteModal />
      </div>
    </div>
  );
};

export default ListeClients;