import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ContactTable = ({ contacts, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const multiplier = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue) * multiplier
    }
    
    return (aValue - bValue) * multiplier
  })
  
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success'
      case 'inactive': return 'error'
      case 'prospect': return 'warning'
      default: return 'default'
    }
  }
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {[
                { field: 'name', label: 'Name' },
                { field: 'email', label: 'Email' },
                { field: 'phone', label: 'Phone' },
                { field: 'company', label: 'Company' },
                { field: 'status', label: 'Status' },
                { field: 'lastContact', label: 'Last Contact' },
                { field: 'actions', label: 'Actions' }
              ].map((column) => (
                <th
                  key={column.field}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 font-body ${
                    column.field !== 'actions' ? 'cursor-pointer hover:bg-gray-200/50 transition-colors duration-200' : ''
                  }`}
                  onClick={() => column.field !== 'actions' && handleSort(column.field)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.field !== 'actions' && (
                      <ApperIcon
                        name={sortField === column.field 
                          ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown')
                          : 'ChevronsUpDown'
                        }
                        size={16}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {sortedContacts.map((contact, index) => (
                <motion.tr
                  key={contact.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.02)' }}
                  className="hover:shadow-sm transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-body">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {contact.tags?.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-body">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-body">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-body">
                    {contact.company}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(contact.status)}>
                      {contact.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-body">
                    {contact.lastContact 
                      ? format(new Date(contact.lastContact), 'MMM dd, yyyy')
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Eye"
                        onClick={() => onView(contact)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Edit"
                        onClick={() => onEdit(contact)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Trash2"
                        onClick={() => onDelete(contact.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ContactTable