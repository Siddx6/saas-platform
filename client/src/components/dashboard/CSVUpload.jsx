import { useState, useRef } from 'react'
import { uploadData } from '../../api/data.api'
import { parseCSV } from '../../utils/parseCSV'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function CSVUpload({ onUploadSuccess }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [parsedData, setParsedData] = useState(null)

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      return setError('Please upload a valid .csv file')
    }
    setError('')
    setSuccess(false)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
    const parsed = parseCSV(e.target.result)
    setParsedData(parsed)
    setPreview(parsed.slice(0, 3))
      setParsedData(parsed)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!preview) return
    try {
      setLoading(true)
      await uploadData({ rows: parsedData })
      setSuccess(true)
      setPreview(null)
      setFileName('')
      onUploadSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className='text-sm font-semibold text-gray-900 mb-4'>Upload Data</h3>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type='file'
          accept='.csv'
          className='hidden'
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <svg className='w-8 h-8 text-gray-400 mx-auto mb-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
        </svg>
        <p className='text-sm text-gray-600'>
          {fileName ? (
            <span className='text-indigo-600 font-medium'>{fileName}</span>
          ) : (
            <>Drop your CSV here or <span className='text-indigo-600 font-medium'>browse</span></>
          )}
        </p>
        <p className='text-xs text-gray-400 mt-1'>Supports .csv files only</p>
      </div>

      {error && <p className='text-xs text-red-500 mt-2'>{error}</p>}

      {/* Preview */}
      {preview && (
        <div className='mt-4'>
          <p className='text-xs font-medium text-gray-500 mb-2'>Preview (first 3 rows)</p>
          <div className='overflow-x-auto rounded-lg border border-gray-200'>
            <table className='w-full text-xs'>
              <thead className='bg-gray-50'>
                <tr>
                  {Object.keys(preview[0]).map((col) => (
                    <th key={col} className='px-3 py-2 text-left text-gray-500 font-medium'>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className='border-t border-gray-100'>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className='px-3 py-2 text-gray-700'>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex gap-2 mt-3'>
            <Button onClick={handleUpload} loading={loading} size='sm'>
              Upload data
            </Button>
            <Button
              onClick={() => { setPreview(null); setFileName('') }}
              variant='secondary'
              size='sm'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {success && (
        <div className='mt-3 flex items-center gap-2 text-sm text-green-600'>
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          Data uploaded successfully
        </div>
      )}
    </Card>
  )
}