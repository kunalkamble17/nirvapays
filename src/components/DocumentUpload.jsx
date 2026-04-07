import { useState, useRef } from 'react'
import { Upload, X, FileText, Image, CheckCircle, AlertCircle } from 'lucide-react'

export default function DocumentUpload({ 
  onDocumentsChange, 
  acceptedTypes = [], 
  maxFiles = 5, 
  maxSize = 5 * 1024 * 1024, // 5MB
  required = false 
}) {
  const [documents, setDocuments] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const documentTypes = {
    'aadhaar': { name: 'Aadhaar Card', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'pan': { name: 'PAN Card', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'voter': { name: 'Voter ID', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'passport': { name: 'Passport', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'driving': { name: 'Driving License', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'income': { name: 'Income Proof', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'address': { name: 'Address Proof', icon: FileText, accept: '.pdf,.jpg,.jpeg,.png' },
    'photo': { name: 'Photograph', icon: Image, accept: '.jpg,.jpeg,.png' },
    'signature': { name: 'Signature', icon: FileText, accept: '.jpg,.jpeg,.png' }
  }

  const validateFile = (file) => {
    const newErrors = []
    
    // Check file size
    if (file.size > maxSize) {
      newErrors.push(`${file.name} exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const allowedExtensions = acceptedTypes.length > 0 
      ? acceptedTypes.flatMap(type => documentTypes[type]?.accept?.split(',') || [])
      : Object.values(documentTypes).flatMap(type => type.accept?.split(',') || [])

    if (!allowedExtensions.includes(fileExtension)) {
      newErrors.push(`${file.name} has invalid file type`)
    }

    return newErrors
  }

  const handleFiles = (files) => {
    const newErrors = []
    const validFiles = []
    
    Array.from(files).forEach(file => {
      const fileErrors = validateFile(file)
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors)
      } else {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploaded: false,
          uploadProgress: 0
        })
      }
    })

    // Check total file limit
    if (documents.length + validFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`)
    }

    setErrors(newErrors)
    
    if (validFiles.length > 0) {
      const updatedDocuments = [...documents, ...validFiles].slice(0, maxFiles)
      setDocuments(updatedDocuments)
      onDocumentsChange(updatedDocuments)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeDocument = (docId) => {
    const updatedDocuments = documents.filter(doc => doc.id !== docId)
    setDocuments(updatedDocuments)
    onDocumentsChange(updatedDocuments)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Documents {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            accept={acceptedTypes.length > 0 
              ? acceptedTypes.flatMap(type => documentTypes[type]?.accept || []).join(',')
              : Object.values(documentTypes).flatMap(type => type.accept).join(',')
            }
            className="hidden"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <span 
                className="font-medium text-primary-600 dark:text-primary-400 cursor-pointer hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs">
              Maximum {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
            {acceptedTypes.length > 0 && (
              <p className="text-xs mt-1">
                Accepted: {acceptedTypes.map(type => documentTypes[type]?.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg dark:bg-danger-900/20 dark:border-danger-800/50">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-danger-700 dark:text-danger-300">
              {errors.map((error, index) => (
                <p key={index} className="mb-1">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Documents</h4>
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(doc.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {doc.uploaded ? (
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                )}
                
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Type Legend */}
      {acceptedTypes.length === 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Supported Document Types:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(documentTypes).map(([key, type]) => (
              <div key={key} className="flex items-center space-x-2">
                <type.icon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
