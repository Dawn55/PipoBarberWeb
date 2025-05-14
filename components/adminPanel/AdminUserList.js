export default function AdminList({ users, currentUserId, onRoleChange, onDeleteUser }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Tüm Kullanıcılar</h2>
      {users.length === 0 ? (
        <p className="text-gray-400">Kullanıcı bulunamadı.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-800">
                <th className="p-3 rounded-tl">Ad Soyad</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telefon</th>
                <th className="p-3">Rol</th>
                <th className="p-3 rounded-tr">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-800">
                  <td className="p-3">
                    {user.name} {user.surname}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phoneNumber}</td>
                  <td className="p-3">
                    <select
                      value={user.isAdmin ? "admin" : "user"}
                      onChange={(e) =>
                        onRoleChange(
                          user.id,
                          e.target.value === "admin"
                        )
                      }
                      className="bg-gray-800 text-white p-2 rounded"
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Sil
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}