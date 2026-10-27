import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, ToggleLeft, ToggleRight, X, Sparkles, HelpCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal.jsx';

const CLASSES = [
  'Java Development', 'MERN Developer', 'Python Developer', 'Frontend Developer'
];

const ACADEMIC_YEARS = [
  '2025-2026',
  '2026-2027',
  '2027-2028',
  '2028-2029'
];

export default function FeeStructureMaster() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form / Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class: CLASSES[0],
    academicYear: '2025-2026',
    admissionFee: 0,
    tuitionFee: 0,
    computerFee: 0,
    activityFee: 0,
    developmentFee: 0,
    smartClassFee: 0,
    transportFee: 0,
    examinationFee: 0,
    annualCharges: 0,
    libraryFee: 0,
    customFees: [],
    isActive: true
  });

  // Custom component input helper states
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomAmount, setNewCustomAmount] = useState(0);
  const [newCustomPeriod, setNewCustomPeriod] = useState('Monthly');

  // Details popover state
  const [viewingStructure, setViewingStructure] = useState(null);

  // Confirm delete modal state
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all structures on mount
  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/fee-structures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFeeStructures(data.data);
      } else {
        setError(data.message || 'Failed to fetch fee structures');
      }
    } catch (err) {
      setError('Error connecting to backend server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      class: CLASSES[0],
      academicYear: ACADEMIC_YEARS[0],
      admissionFee: 0,
      tuitionFee: 0,
      computerFee: 0,
      activityFee: 0,
      developmentFee: 0,
      smartClassFee: 0,
      transportFee: 0,
      examinationFee: 0,
      annualCharges: 0,
      libraryFee: 0,
      customFees: [],
      isActive: true
    });
    setNewCustomName('');
    setNewCustomAmount(0);
    setNewCustomPeriod('Monthly');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (struct) => {
    setEditingId(struct._id);
    setFormData({
      class: struct.class,
      academicYear: struct.academicYear || '2025-2026',
      admissionFee: struct.admissionFee || 0,
      tuitionFee: struct.tuitionFee || 0,
      computerFee: struct.computerFee || 0,
      activityFee: struct.activityFee || 0,
      developmentFee: struct.developmentFee || 0,
      smartClassFee: struct.smartClassFee || 0,
      transportFee: struct.transportFee || 0,
      examinationFee: struct.examinationFee || 0,
      annualCharges: struct.annualCharges || 0,
      libraryFee: struct.libraryFee || 0,
      customFees: struct.customFees || [],
      isActive: struct.isActive !== undefined ? struct.isActive : true
    });
    setNewCustomName('');
    setNewCustomAmount(0);
    setNewCustomPeriod('Monthly');
    setError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumericInputChange = (field, value) => {
    const num = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num
    }));
  };

  const handleAddCustomFee = () => {
    if (!newCustomName.trim()) {
      setError('Please provide a name for the custom fee component');
      return;
    }
    const amt = parseFloat(newCustomAmount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please provide a valid positive amount');
      return;
    }

    setFormData(prev => ({
      ...prev,
      customFees: [
        ...prev.customFees,
        { name: newCustomName.trim(), amount: amt, period: newCustomPeriod }
      ]
    }));
    setNewCustomName('');
    setNewCustomAmount(0);
    setNewCustomPeriod('Monthly');
    setError('');
  };

  const handleRemoveCustomFee = (index) => {
    setFormData(prev => ({
      ...prev,
      customFees: prev.customFees.filter((_, i) => i !== index)
    }));
  };

  // Automated Calculations helper
  const calculateTotals = (data) => {
    const monthlySum = 
      (data.tuitionFee || 0) +
      (data.computerFee || 0) +
      (data.activityFee || 0) +
      (data.smartClassFee || 0) +
      (data.transportFee || 0) +
      (data.libraryFee || 0) +
      (data.customFees || [])
        .filter(c => c.period === 'Monthly')
        .reduce((sum, item) => sum + (item.amount || 0), 0);

    const annualSum = 
      (data.admissionFee || 0) +
      (data.developmentFee || 0) +
      (data.examinationFee || 0) +
      (data.annualCharges || 0) +
      (data.customFees || [])
        .filter(c => c.period === 'Annual')
        .reduce((sum, item) => sum + (item.amount || 0), 0) +
      (monthlySum * 12);

    return { monthlySum, annualSum };
  };

  const { monthlySum: currentMonthlyTotal, annualSum: currentAnnualTotal } = calculateTotals(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `/api/admin/fee-structures/${editingId}`
        : '/api/admin/fee-structures';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? 'Fee structure updated successfully!' : 'Fee structure created successfully!');
        setIsModalOpen(false);
        fetchStructures();
        // Clear message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Operation failed. Check details.');
      }
    } catch (err) {
      setError('Communication with server failed');
      console.error(err);
    }
  };

  const handleToggleActive = async (id) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/fee-structures/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFeeStructures(prev =>
          prev.map(item => (item._id === id ? { ...item, isActive: data.data.isActive } : item))
        );
        setSuccess('Status updated successfully!');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.message || 'Failed to toggle status');
      }
    } catch (err) {
      setError('Communication with server failed');
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeletingId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    setIsConfirmDeleteOpen(false);
    if (!deletingId) return;

    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/fee-structures/${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Fee structure deleted successfully.');
        fetchStructures();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete fee structure');
      }
    } catch (err) {
      setError('Failed to contact server');
    } finally {
      setDeletingId(null);
    }
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    if (filteredStructures.length === 0) return;

    // Headers
    const headers = [
      'Course',
      'Academic Year',
      'Admission Fee',
      'Tuition Fee',
      'Computer Fee',
      'Activity Fee',
      'Development Fee',
      'Smart Class Fee',
      'Transport Fee',
      'Examination Fee',
      'Annual Charges',
      'Library Fee',
      'Custom Components Count',
      'Total Monthly Fee',
      'Total Annual Fee',
      'Status'
    ];

    const rows = filteredStructures.map(item => {
      const { monthlySum, annualSum } = calculateTotals(item);
      return [
        item.class,
        item.academicYear,
        item.admissionFee,
        item.tuitionFee,
        item.computerFee,
        item.activityFee,
        item.developmentFee,
        item.smartClassFee,
        item.transportFee,
        item.examinationFee,
        item.annualCharges,
        item.libraryFee,
        item.customFees?.length || 0,
        monthlySum,
        annualSum,
        item.isActive ? 'Active' : 'Inactive'
      ];
    });

    const csvContent = 
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Structure_Master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering Logic
  const filteredStructures = feeStructures.filter(item => {
    const matchesSearch = 
      item.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.academicYear || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter ? item.class === classFilter : true;
    const matchesYear = yearFilter ? item.academicYear === yearFilter : true;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = item.isActive === true;
    else if (statusFilter === 'inactive') matchesStatus = item.isActive === false;

    return matchesSearch && matchesClass && matchesYear && matchesStatus;
  });

  // Pagination Logic
  const totalItems = filteredStructures.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedStructures = filteredStructures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col items-start justify-between gap-4 pb-4 border-b sm:flex-row sm:items-center border-orange-50">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold font-quicksand text-slate-800">
            <Sparkles className="w-5 h-5 text-brandCoral animate-pulse" />
            Fee Structure Master
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Manage class-wise tuition, admission, and custom academic fee models.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={filteredStructures.length === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#5B468C] hover:bg-[#4a3973] rounded-2xl transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Fee Structure
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3 text-xs font-bold border text-brandMint-dark bg-brandMint/10 border-brandMint/30 rounded-2xl animate-fade-in">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 text-xs font-bold text-red-600 border border-red-100 bg-red-50 rounded-2xl">
          {error}
        </div>
      )}

      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 gap-4 p-5 text-xs font-bold border md:grid-cols-4 bg-slate-50/50 border-slate-100 rounded-3xl text-slate-600">
        <div className="space-y-1">
          <label>Search Text</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search course or year..."
              className="bg-white border border-slate-200 rounded-xl p-2.5 pl-8 w-full outline-none text-xs text-slate-700 font-semibold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>

        <div className="space-y-1">
          <label>Course Filter</label>
          <select
            value={classFilter}
            onChange={e => { setClassFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
          >
            <option value="">-- All Courses --</option>
            {CLASSES.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label>Academic Year</label>
          <select
            value={yearFilter}
            onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
          >
            <option value="">-- All Years --</option>
            {ACADEMIC_YEARS.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-600"
          >
            <option value="all">-- All Statuses --</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      {loading ? (
        <div className="py-20 text-xs font-semibold text-center text-slate-400">
          Loading fee structures...
        </div>
      ) : paginatedStructures.length === 0 ? (
        <div className="py-20 text-xs font-semibold text-center bg-white border shadow-sm border-slate-100 rounded-3xl text-slate-400">
          No fee structures found matching the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto bg-white border shadow-sm border-slate-150 rounded-3xl">
            <table className="w-full text-left border-collapse text-[11px] font-semibold text-slate-600">
              <thead>
                <tr className="font-bold tracking-wider uppercase border-b bg-slate-50 border-slate-150 text-slate-500">
                  <th className="p-4">Course</th>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4 text-right">Tuition Fee (Monthly)</th>
                  <th className="p-4 text-right">Total Monthly</th>
                  <th className="p-4 text-right">Total Annual</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStructures.map((item) => {
                  const { monthlySum, annualSum } = calculateTotals(item);
                  return (
                    <tr key={item._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="p-4 text-xs font-bold text-slate-800">
                        {item.class}
                      </td>
                      <td className="p-4">
                        {item.academicYear || '2025-2026'}
                      </td>
                      <td className="p-4 font-medium text-right">
                        ₹{(item.tuitionFee || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-bold text-right text-slate-800">
                        ₹{monthlySum.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-bold text-right text-brandCoral">
                        ₹{annualSum.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActive(item._id)}
                          title="Click to toggle status"
                          className="transition-transform focus:outline-none hover:scale-110 active:scale-95"
                        >
                          {item.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brandMint/10 text-brandMint-dark border border-brandMint/30 text-[9px] font-bold uppercase">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase">
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingStructure(item)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                            title="View full breakdown"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => triggerDeleteConfirm(item._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-500">
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} structures
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1.5 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50 transition-all select-none cursor-pointer"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl border transition-all ${
                      currentPage === i + 1
                        ? 'bg-[#5B468C] text-white border-[#5B468C]'
                        : 'bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1.5 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50 transition-all select-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAILS VIEW MODAL */}
      {viewingStructure && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingStructure(null)}
              className="absolute p-2 transition-all rounded-full top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5B468C] tracking-widest bg-[#5B468C]/10 px-2.5 py-1 rounded-full border border-[#5B468C]/20">
                  {viewingStructure.academicYear || '2025-2026'} Academic Year
                </span>
                <h3 className="mt-2 text-2xl font-black font-quicksand text-slate-800">
                  {viewingStructure.class} Fee Structure
                </h3>
              </div>

              {/* Components breakdown */}
              <div className="space-y-4">
                <div className="p-4 border bg-slate-50/50 border-slate-100 rounded-2xl">
                  <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-slate-400">Monthly Components</h4>
                  <div className="grid grid-cols-2 text-xs font-semibold gap-y-2 text-slate-600">
                    <div>Tuition Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.tuitionFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Computer Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.computerFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Activity Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.activityFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Smart Class Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.smartClassFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Transport Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.transportFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Library Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.libraryFee || 0).toLocaleString('en-IN')}</div>

                    {/* Custom Monthly */}
                    {(viewingStructure.customFees || []).filter(c => c.period === 'Monthly').map((cf, i) => (
                      <React.Fragment key={i}>
                        <div>{cf.name} (Custom):</div>
                        <div className="text-right text-slate-800">₹{(cf.amount || 0).toLocaleString('en-IN')}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="p-4 border bg-slate-50/50 border-slate-100 rounded-2xl">
                  <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-slate-400">One-time / Annual Components</h4>
                  <div className="grid grid-cols-2 text-xs font-semibold gap-y-2 text-slate-600">
                    <div>Admission Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.admissionFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Development Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.developmentFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Examination Fee:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.examinationFee || 0).toLocaleString('en-IN')}</div>
                    
                    <div>Annual Charges:</div>
                    <div className="text-right text-slate-800">₹{(viewingStructure.annualCharges || 0).toLocaleString('en-IN')}</div>

                    {/* Custom Annual */}
                    {(viewingStructure.customFees || []).filter(c => c.period === 'Annual').map((cf, i) => (
                      <React.Fragment key={i}>
                        <div>{cf.name} (Custom):</div>
                        <div className="text-right text-slate-800">₹{(cf.amount || 0).toLocaleString('en-IN')}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Final Totals */}
                {(() => {
                  const { monthlySum, annualSum } = calculateTotals(viewingStructure);
                  return (
                    <div className="p-5 border-4 border-white bg-orange-50/50 rounded-[2rem] shadow-sm grid grid-cols-2 gap-y-3 font-bold text-sm text-slate-700">
                      <div>Total Monthly Fee:</div>
                      <div className="text-lg font-extrabold text-right text-slate-800 font-quicksand">
                        ₹{monthlySum.toLocaleString('en-IN')}
                      </div>
                      
                      <div>Total Annual Fee:</div>
                      <div className="text-xl font-black text-right text-brandCoral font-quicksand">
                        ₹{annualSum.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setViewingStructure(null);
                    handleOpenEditModal(viewingStructure);
                  }}
                  className="flex-1 py-3 px-4 font-bold text-xs text-white bg-[#5B468C] hover:bg-[#4a3973] rounded-2xl transition-all shadow-md text-center"
                >
                  Edit Fee Structure
                </button>
                <button
                  onClick={() => setViewingStructure(null)}
                  className="flex-1 px-4 py-3 text-xs font-bold text-center transition-all text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-2xl p-6 md:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute p-2 transition-all rounded-full top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-slate-600">
              <div>
                <h3 className="text-2xl font-black font-quicksand text-slate-800">
                  {editingId ? 'Edit Fee Structure' : 'Create New Fee Structure'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  Specify details for monthly and annual school fee components.
                </p>
              </div>

              {/* Course and Year Selection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Course *</label>
                  <select
                    value={formData.class}
                    onChange={e => handleInputChange('class', e.target.value)}
                    disabled={!!editingId}
                    className="bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  >
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Academic Year *</label>
                  <select
                    value={formData.academicYear}
                    onChange={e => handleInputChange('academicYear', e.target.value)}
                    disabled={!!editingId}
                    className="bg-[#0f172a] border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  >
                    {ACADEMIC_YEARS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Active Status</label>
                  <div className="flex items-center h-10">
                    <button
                      type="button"
                      onClick={() => handleInputChange('isActive', !formData.isActive)}
                      className="flex items-center text-[#5B468C] focus:outline-none transition-transform active:scale-95"
                    >
                      {formData.isActive ? (
                        <ToggleRight className="w-9 h-9 text-brandMint-dark" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-300" />
                      )}
                      <span className="ml-2 font-bold select-none text-slate-700">
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="mb-3 text-sm font-bold text-slate-800">Fee Components (₹)</h4>
                
                {/* Standard Fee Components Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-slate-500">Admission Fee (One-Time)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.admissionFee}
                      onChange={e => handleNumericInputChange('admissionFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Tuition Fee (Monthly)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tuitionFee}
                      onChange={e => handleNumericInputChange('tuitionFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Computer Fee (Monthly)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.computerFee}
                      onChange={e => handleNumericInputChange('computerFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Activity Fee (Monthly)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.activityFee}
                      onChange={e => handleNumericInputChange('activityFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Development Fee (Annual)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.developmentFee}
                      onChange={e => handleNumericInputChange('developmentFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Smart Class Fee (Monthly)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.smartClassFee}
                      onChange={e => handleNumericInputChange('smartClassFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Transport Fee (Monthly)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.transportFee}
                      onChange={e => handleNumericInputChange('transportFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Examination Fee (Annual)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.examinationFee}
                      onChange={e => handleNumericInputChange('examinationFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Annual Charges (Annual)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.annualCharges}
                      onChange={e => handleNumericInputChange('annualCharges', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Library Fee (Monthly)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.libraryFee}
                      onChange={e => handleNumericInputChange('libraryFee', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 w-full outline-none font-semibold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Fee Components Section */}
              <div className="pt-4 space-y-3 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">Custom Fee Components</h4>
                
                {/* Custom list */}
                {formData.customFees.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border bg-slate-50 border-slate-100 rounded-2xl">
                    {formData.customFees.map((cf, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm"
                      >
                        {cf.name}: ₹{cf.amount} ({cf.period})
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomFee(idx)}
                          className="ml-1 text-xs text-red-400 hover:text-red-600 focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Custom Form Row */}
                <div className="flex flex-col items-end gap-3 p-3 border border-dashed sm:flex-row bg-slate-50/50 border-slate-200 rounded-2xl">
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-slate-400">Component Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lab Fee, Sports Fee"
                      value={newCustomName}
                      onChange={e => setNewCustomName(e.target.value)}
                      className="w-full p-2 text-xs font-semibold bg-white border outline-none border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="w-full space-y-1 sm:w-28">
                    <label className="text-slate-400">Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCustomAmount}
                      onChange={e => setNewCustomAmount(e.target.value)}
                      className="w-full p-2 text-xs font-semibold bg-white border outline-none border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="w-full space-y-1 sm:w-28">
                    <label className="text-slate-400">Billing Period</label>
                    <select
                      value={newCustomPeriod}
                      onChange={e => setNewCustomPeriod(e.target.value)}
                      className="w-full p-2 text-xs font-semibold bg-[#0f172a] outline-none bg-[#0f172a] border-slate-200 rounded-xl text-slate-600"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomFee}
                    className="w-full px-4 py-2 text-xs font-bold transition-colors sm:w-auto bg-[#0f172a]hover:bg-slate-300 text-slate-700 rounded-xl"
                  >
                    + Add Component
                  </button>
                </div>
              </div>

              {/* Automatic Calculated Live Totals */}
              <div className="p-5 border-4 border-white bg-orange-50/50 rounded-[2rem] shadow-sm grid grid-cols-2 gap-y-3 font-bold text-sm text-slate-700">
                <div>Total Monthly Fee:</div>
                <div className="text-lg font-extrabold text-right text-slate-800 font-quicksand">
                  ₹{currentMonthlyTotal.toLocaleString('en-IN')}
                </div>
                
                <div>Total Annual Fee:</div>
                <div className="text-xl font-black text-right text-brandCoral font-quicksand">
                  ₹{currentAnnualTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 text-xs font-bold text-center transition-all select-none text-slate-600 bg-[#0f172a] hover:bg-red-800 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 font-bold text-xs text-white bg-[#5B468C] hover:bg-[#4a3973] rounded-2xl transition-all shadow-md text-center select-none"
                >
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Delete Fee Structure"
        message="Are you sure you want to delete this class fee structure? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        confirmText="Yes, Delete"
        cancelText="No, Keep It"
        type="delete"
      />
    </div>
  );
}
