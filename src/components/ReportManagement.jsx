import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { AlertTriangle, CheckCircle, Clock, ChevronLeft, ChevronRight, User, Calendar, FileText, ArrowUpDown, Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const TYPE_FILTERS = [
  { value: 'all', label: '모든 유형' },
  { value: 'weight', label: '체중 관리' },
  { value: 'blood_sugar', label: '혈당 관리' },
  { value: 'meal', label: '식단 관리' },
];

export function ReportManagement() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');     
  const [sortOrder, setSortOrder] = useState('latest');    
  
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]); 
  const [reportStats, setReportStats] = useState({ total: 0, waiting: 0, approval: 0 }); 
  const [loading, setLoading] = useState(false);

  // 통계 API 호출
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/management/reports/stats');
        if (response.data.success) {
          setReportStats(response.data.data);
        }
      } catch (error) {
        console.error("신고 통계 로딩 실패:", error);
      }
    };
    fetchStats();
  }, []);

  // 리스트 API 호출
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const apiStatus = statusFilter === 'pending' ? 'wait' : statusFilter === 'resolved' ? 'completed' : 'all';
        const apiTime = sortOrder === 'latest' ? 'recent' : 'old';

        const response = await axios.get('/management/reports', {
          params: {
            status: apiStatus,
            type: typeFilter,
            time: apiTime
          }
        });

        if (response.data.success) {
          setReports(response.data.data);
        }
      } catch (error) {
        console.error("신고 목록 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [statusFilter, typeFilter, sortOrder]);

  // 처리 완료 핸들러 (PATCH 요청)
  const handleComplete = async (reportId) => {
    // 사용자 확인 (선택 사항)
    if (!window.confirm('이 신고를 처리 완료하시겠습니까?')) return;

    try {
      // PATCH /management/reports?id={reportId}
      // 두 번째 인자(Body)는 null, 세 번째 인자(Config)에 params를 넣음
      const response = await axios.patch('/management/reports', null, {
        params: { id: reportId }
      });

      if (response.data.success) {
        // 성공 메시지 알림
        alert(response.data.message);

        // 리스트 상태 업데이트 (해당 항목을 '처리완료'로 변경)
        setReports((prevReports) => 
          prevReports.map((report) => 
            report.id === reportId ? { ...report, status: '처리완료' } : report
          )
        );

        // 상단 통계 숫자 업데이트 (대기중 -1, 처리완료 +1)
        setReportStats((prev) => ({
          ...prev,
          waiting: Math.max(0, prev.waiting - 1),
          approval: prev.approval + 1
        }));

      } else {
        // 실패 메시지 (이미 처리되었거나 ID 없음)
        alert(response.data.message);
      }
    } catch (error) {
      console.error("신고 처리 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReports = reports.slice(startIndex, endIndex);

  const getStatusBadge = (statusText) => {
    if (statusText === '대기중') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
          <Clock className="w-3 h-3" />
          대기중
        </span>
      );
    } else if (statusText === '처리완료') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle className="w-3 h-3" />
          처리완료
        </span>
      );
    } else {
      return <span className="text-gray-500 text-xs">{statusText}</span>;
    }
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.replace('T', ' ').slice(0, 16) : '-';
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          신고 관리
        </h2>
        <p className="text-sm lg:text-base text-gray-600">사용자들의 신고 내용을 관리합니다</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50 flex items-center justify-between sm:block">
          <div className="flex items-center gap-3 mb-0 sm:mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-gray-600 font-medium">전체 신고</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {reportStats.total.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">건</span>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50 flex items-center justify-between sm:block">
          <div className="flex items-center gap-3 mb-0 sm:mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-gray-600 font-medium">대기중</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {reportStats.waiting.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">건</span>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50 flex items-center justify-between sm:block">
          <div className="flex items-center gap-3 mb-0 sm:mb-2">
             <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
             </div>
            <p className="text-gray-600 font-medium">처리완료</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {reportStats.approval.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">건</span>
          </p>
        </div>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-2">
          
          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: 'all', label: '전체 보기' },
              { value: 'pending', label: '대기중' },
              { value: 'resolved', label: '처리완료' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setStatusFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  statusFilter === filter.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-px h-8 bg-gray-300 mx-2"></div>

          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="flex items-center gap-1 mr-1 text-gray-400">
               <Filter className="w-4 h-4" />
            </div>
            {TYPE_FILTERS.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setTypeFilter(type.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border ${
                  typeFilter === type.value
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 self-start lg:self-auto">
            <button
              onClick={() => setSortOrder('latest')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                sortOrder === 'latest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-3 h-3" />
              최신순
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                sortOrder === 'oldest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              오래된순
            </button>
          </div>

        </div>
      </div>

      {/* Reports List - Mobile */}
      <div className="lg:hidden space-y-4">
        {loading ? (
           <div className="text-center py-10 text-gray-500">로딩 중...</div>
        ) : currentReports.length > 0 ? (
          currentReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User className="w-5 h-5" />
                  </div>
                  <div>
                      <h3 className="text-gray-900 font-bold text-sm">{report.userName}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.reportedAt)}
                      </div>
                  </div>
                </div>
                {getStatusBadge(report.status)}
              </div>

              <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-bold text-gray-800">{report.reportType}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-600 leading-relaxed border border-gray-100">
                      {report.content}
                  </div>
              </div>

              {/* status가 '대기중'일 때만 완료 버튼 표시 */}
              {report.status === '대기중' && (
                  <button
                    onClick={() => handleComplete(report.id)}
                    className="w-full py-3 bg-white border border-green-500 text-green-600 font-medium rounded-xl hover:bg-green-50 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    처리 완료로 변경
                  </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 bg-white/50 rounded-2xl">
            해당 조건의 신고 내역이 없습니다.
          </div>
        )}
      </div>

      {/* Reports List - Desktop */}
      <div className="hidden lg:block space-y-3">
        {loading ? (
           <div className="text-center py-20 text-gray-500">데이터를 불러오는 중입니다...</div>
        ) : currentReports.length > 0 ? (
          currentReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-6">
                <div className="w-48 flex-shrink-0 space-y-2">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-gray-900">{report.userName}</p>
                          <p className="text-xs text-gray-500">{formatDate(report.reportedAt)}</p>
                      </div>
                  </div>
                  <div className="px-2.5 py-1 bg-gray-50 rounded-lg w-fit">
                      <p className="text-xs font-semibold text-gray-700">{report.reportType}</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed border border-gray-100 h-full">
                      {report.content}
                  </div>
                </div>
                
                <div className="w-40 flex-shrink-0 flex flex-col items-end gap-3 justify-center">
                  {getStatusBadge(report.status)}
                  {report.status === '대기중' && (
                    <button
                      onClick={() => handleComplete(report.id)}
                      className="w-full py-2 px-3 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                    >
                      처리완료
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white/50 rounded-2xl border border-dashed border-gray-300">
             조건에 맞는 신고 내역이 없습니다.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-200/50">
          <div className="text-sm text-gray-500">
            총 {reports.length}건 중 {startIndex + 1}-{Math.min(endIndex, reports.length)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}