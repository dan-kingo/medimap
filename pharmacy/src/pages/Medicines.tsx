import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react'

const Medicines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data - replace with actual API calls
  const medicines = [
    {
      id: '1',
      name: 'Paracetamol',
      strength: '500mg',
      type: 'Tablet',
      price: 5.99,
      quantity: 150,
      requiresPrescription: false,
      outOfStock: false,
    },
    {
      id: '2',
      name: 'Amoxicillin',
      strength: '250mg',
      type: 'Tablet',
      price: 12.50,
      quantity: 3,
      requiresPrescription: true,
      outOfStock: false,
    },
    {
      id: '3',
      name: 'Cough Syrup',
      strength: '100ml',
      type: 'Syrup',
      price: 8.75,
      quantity: 0,
      requiresPrescription: false,
      outOfStock: true,
    },
  ]

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
          <p className="text-gray-600">Manage your pharmacy inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select className="input sm:w-48">
              <option value="">All Types</option>
              <option value="tablet">Tablet</option>
              <option value="syrup">Syrup</option>
              <option value="injection">Injection</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <div key={medicine.id} className="card">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">{medicine.strength} • {medicine.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-50">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-error-600 rounded-lg hover:bg-gray-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">${medicine.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <div className="flex items-center">
                    {medicine.quantity <= 10 && medicine.quantity > 0 && (
                      <AlertTriangle className="h-4 w-4 text-warning-500 mr-1" />
                    )}
                    <span className={`font-semibold ${
                      medicine.outOfStock ? 'text-error-600' :
                      medicine.quantity <= 10 ? 'text-warning-600' : 'text-success-600'
                    }`}>
                      {medicine.outOfStock ? 'Out of Stock' : medicine.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Prescription:</span>
                  <span className={`badge ${
                    medicine.requiresPrescription ? 'badge-warning' : 'badge-success'
                  }`}>
                    {medicine.requiresPrescription ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  className={`btn w-full ${
                    medicine.outOfStock ? 'btn-secondary' : 'btn-primary'
                  }`}
                  disabled={medicine.outOfStock}
                >
                  {medicine.outOfStock ? 'Restock' : 'Update Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
          <p className="text-gray-600">Try adjusting your search or add a new medicine.</p>
        </div>
      )}
    </div>
  )
}

export default Medicines