import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '../types/user';
import { useToast } from '../components/ToastContainer';
import Button from '../components/Button';
import Modal from '../components/Modal';

const USERS_PER_PAGE = 10;

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalAction, setModalAction] = useState<'activate' | 'deactivate' | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const mockUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        email: `user${i + 1}@example.com`,
        full_name: `User ${i + 1}`,
        role: i === 0 ? 'admin' : 'user',
        status: i % 3 === 0 ? 'inactive' : 'active',
        created_at: new Date(Date.now() - i * 86400000).toISOString()
      }));
      setUsers(mockUsers);
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const handleOpenModal = (user: User, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setModalAction(action);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalAction(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !modalAction) return;

    try {
      const newStatus = modalAction === 'activate' ? 'active' : 'inactive';
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u
        )
      );
      showToast(
        `User ${modalAction === 'activate' ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
    } catch (error) {
      showToast('Action failed', 'error');
    } finally {
      handleCloseModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {user.status === 'active' ? (
                        <Button
                          variant="destructive"
                          onClick={() => handleOpenModal(user, 'deactivate')}
                          className="text-xs px-3 py-1"
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleOpenModal(user, 'activate')}
                          className="text-xs px-3 py-1"
                        >
                          Activate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, users.length)}</span> of{' '}
              <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!modalAction}
        onClose={handleCloseModal}
        title={`${modalAction === 'activate' ? 'Activate' : 'Deactivate'} User`}
        onConfirm={handleConfirmAction}
        confirmText={modalAction === 'activate' ? 'Activate' : 'Deactivate'}
        confirmVariant={modalAction === 'deactivate' ? 'destructive' : 'primary'}
      >
        <p className="text-gray-700">
          Are you sure you want to {modalAction} user{' '}
          <span className="font-semibold">{selectedUser?.email}</span>?
        </p>
      </Modal>
    </div>
  );
}
