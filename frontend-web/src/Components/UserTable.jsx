const UserTable = ({ users, onDelete, onEdit }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-3 px-2">{user.name}</td>
                <td className="py-3 px-2">{user.email}</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-500 rounded-full text-xs">
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-500 hover:underline text-sm"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-500 hover:underline text-sm"
                      onClick={() => onDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UserTable;