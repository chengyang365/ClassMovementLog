import React, { useState, useEffect } from 'react';
import { 
  LogOut, LogIn, FileText, CheckCircle, ChevronLeft, Settings, Users, Plus, 
  Trash2, Save, School, ArrowRight, CheckSquare, Square, AlertCircle, 
  AlertTriangle, UserX, Calendar, PenTool, User, Monitor, X, Download, 
  Upload, Database, BarChart3, PieChart, CalendarRange, Lock, Clock, 
  CalendarDays, Timer, AlertOctagon, Printer 
} from 'lucide-react';

// --- 辅助函数：智能拆分中英文名字 ---
const parseName = (fullName) => {
  if (!fullName) return { cn: '', my: '' };
  
  const cnMatch = fullName.match(/[\u4e00-\u9fa5]+/g);
  const cn = cnMatch ? cnMatch.join('') : '';
  
  const my = fullName
    .replace(/[\u4e00-\u9fa5]+/g, '')
    .replace(/[()（）]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { cn, my };
};

// --- 辅助函数：生成全校默认班级数据 (Dynamic Year) ---
const generateDefaultClasses = () => {
  const currentYear = new Date().getFullYear();
  
  // 学校班级结构
  const structure = [
    { level: 1, classes: ['A', 'B', 'C', 'D', 'E'] }, // 5班
    { level: 2, classes: ['A', 'B', 'C', 'D', 'E'] }, // 5班
    { level: 3, classes: ['A', 'B', 'C', 'D', 'E'] }, // 5班
    { level: 4, classes: ['A', 'B', 'C', 'D'] },      // 4班
    { level: 5, classes: ['A', 'B', 'C', 'D', 'E'] }, // 5班
    { level: 6, classes: ['A', 'B', 'C'] },           // 3班
  ]; // 总计 27 班

  // 老师名单 (共27位)
  const teachers = [
    "En Tan Hau Vind 陈皓运师", "En Yap Min Yan 叶民彦师", "Cik Ong Wen Jing 王文静师", "Pn Lee Yoke Yean 李育燕师", "Cik Oi Swee Chien 黄翠涓师",
    "Pn Rinny Seah Kwee Jean 佘桂仁师", "En Chong Cheng Yang 张政扬师", "Pn Tan Hui Kee 陈惠琪师", "Cik Nabila Binti Suhaimi", "Pn Chin Lee Mei 陈丽美师",
    "Pn Chiam Ai Ying 詹爱莹师", "En Winson Eng Wei Siang 黄伟祥师", "Cik Leong Siew Fern 梁筱芬师", "Cik Lim Sie Pei 林诗佩师", "Cik Tan Lee Ching 陈丽清师",
    "En Lim Kian Pin 林建品师", "En Willson Lim 林伟胜师", "Cik Lim Hui Ying 林卉颖师", "Cik Tay Sue Ching 郑淑琴师", "Pn Ngu Ling Houng 吴霖芳师",
    "Cik Heng Wui Sing 邢伟芯师", "Pn Koo Cheng Yee 古倩仪师", "Pn Ng Dong Yu 黄董宇师", "En Tan Sik Hong 陈实丰师", "Pn Lee Siow Mee 李晓梅师",
    "Pn Cher Ruey Ming 曹瑞敏师", "Pn Chua Chea Leng 蔡静玲师"
  ];

  // 老师名单对应的班级顺序 (3A-6C, 然后 1A-2E)
  const teacherClassOrder = [
    '3A', '3B', '3C', '3D', '3E', // 0-4
    '4A', '4B', '4C', '4D',       // 5-8
    '5A', '5B', '5C', '5D', '5E', // 9-13
    '6A', '6B', '6C',             // 14-16
    '1A', '1B', '1C', '1D', '1E', // 17-21
    '2A', '2B', '2C', '2D', '2E'  // 22-26
  ];

  // 建立班级->老师的映射表
  const teacherMap = {};
  teacherClassOrder.forEach((cls, index) => {
    if (teachers[index]) {
      teacherMap[cls] = teachers[index];
    }
  });

  const students1A = [
      "Aidan Liew 廖伟健", "Chong Wei Han 张伟汉", "Nurul Aisyah", "Siti Aminah", 
      "Tan Yi Xuan 陈一轩", "Muthu Kumar", "Lee Zi Yang 李子洋", "Wong Mei Ling 黄美玲",
      "Jayden Lim 林杰登", "Damia Batrisya", "Lucas Tan 陈卢卡斯", "Sofia Zara",
      "Ng Kai Lun 黄凯伦", "Rania Eryna", "Teoh Zhi Ming 张志明", "Zara Sophia",
      "Ahmad Ali", "Brendan Low 刘布登", "Chloe Tan 陈克洛伊", "Danial Arif"
  ];

  let allClasses = [];

  structure.forEach(grade => {
    grade.classes.forEach(cls => {
      const className = `${grade.level}${cls}`;
      // 从映射表中查找对应的老师
      const teacherName = teacherMap[className] || 'Guru Kelas';
      
      allClasses.push({
        id: `${className.toLowerCase()}_${currentYear}`,
        name: `${className} (${currentYear})`,
        teacher: teacherName,
        students: className === '1A' ? students1A : []
      });
    });
  });
  return allClasses;
};

const DEFAULT_CLASSES = generateDefaultClasses();

const REASONS = [
  { id: 'tandas', label: '厕所', labelMy: 'Tandas', icon: '🚽', color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-400' },
  { id: 'pejabat', label: '办公室', labelMy: 'Pejabat', icon: '🏢', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-400' },
  { id: 'guru', label: '见老师', labelMy: 'Jumpa Guru', icon: '👩‍🏫', color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-400' },
  { id: 'lain', label: '其他', labelMy: 'Lain-lain', icon: '❓', color: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-400' }
];

// --- 新增：其他原因的预设选项 ---
const PRESET_OTHER_REASONS = [
  { label: '图书馆', labelMy: 'Perpustakaan', icon: '📚' },
  { label: '辅导室', labelMy: 'Bilik Kaunseling', icon: '🛋️' },
  { label: '医疗室', labelMy: 'Bilik Sakit', icon: '🚑' },
  { label: '食堂', labelMy: 'Kantin', icon: '🍽️' },
  { label: '装水/洗手', labelMy: 'Isi Air/Basuh', icon: '🚰' },
  { label: '拿东西', labelMy: 'Ambil Barang', icon: '🎒' },
];

const UserAvatar = ({ name, size = "md", active = false }) => {
  const { cn, my } = parseName(name);
  let initials = "";
  if (my && my.length > 0) {
    initials = my.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  } else if (cn && cn.length > 0) {
    initials = cn[0];
  } else {
    initials = "?";
  }
  
  const colorIndex = name.length % 6;
  const colors = ['bg-red-100 text-red-600', 'bg-orange-100 text-orange-600', 'bg-amber-100 text-amber-600', 'bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600'];
  const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm";
  const colorClass = active ? "bg-white/20 text-white" : colors[colorIndex];

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold shrink-0 border-2 border-white/50 shadow-sm`}>
      {initials}
    </div>
  );
};

export default function App() {
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [activeClassId, setActiveClassId] = useState(null); 
  const [view, setView] = useState('landing'); 
  const [logs, setLogs] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); 
  const [tempAbsentees, setTempAbsentees] = useState([]); 
  const [assignedClassIds, setAssignedClassIds] = useState([]); 
  const [selectedOutStudents, setSelectedOutStudents] = useState([]); 
  const [selectedReturnIds, setSelectedReturnIds] = useState([]); 
  const [showCustomReasonInput, setShowCustomReasonInput] = useState(false);
  const [customReasonText, setCustomReasonText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [confirmReturnId, setConfirmReturnId] = useState(null); 
  const [globalModal, setGlobalModal] = useState(null); 
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingClass, setEditingClass] = useState(null); 
  const [statsView, setStatsView] = useState('monthly'); // 'monthly', 'yearly'
  const [statsTab, setStatsTab] = useState('overview'); // 'overview', 'time', 'duration', 'day'
  const [isExamMode, setIsExamMode] = useState(false); // New: Exam Mode

  useEffect(() => {
    try {
      const savedClasses = localStorage.getItem('school_classes');
      const savedLogs = localStorage.getItem('school_logs');
      const savedAttendance = localStorage.getItem('school_attendance');
      const savedAssignedIds = localStorage.getItem('device_assigned_class_ids');
      const savedExamMode = localStorage.getItem('school_exam_mode');
      
      if (savedClasses) setClasses(JSON.parse(savedClasses));
      else setClasses(DEFAULT_CLASSES);

      if (savedLogs) setLogs(JSON.parse(savedLogs));
      if (savedAttendance) setAttendanceData(JSON.parse(savedAttendance));
      if (savedExamMode) setIsExamMode(JSON.parse(savedExamMode));
      
      if (savedAssignedIds) {
        setAssignedClassIds(JSON.parse(savedAssignedIds));
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { localStorage.setItem('school_classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('school_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('school_attendance', JSON.stringify(attendanceData)); }, [attendanceData]);
  useEffect(() => { localStorage.setItem('school_exam_mode', JSON.stringify(isExamMode)); }, [isExamMode]);
  useEffect(() => { 
    localStorage.setItem('device_assigned_class_ids', JSON.stringify(assignedClassIds));
  }, [assignedClassIds]);

  const getActiveClass = () => classes.find(c => c.id === activeClassId);
  // --- Modified: 12-hour format ---
  const formatTime = (dateObj) => dateObj ? new Date(dateObj).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '-';
  const formatDate = (dateObj) => new Date(dateObj).toLocaleDateString('en-GB');
  const getTodayString = () => new Date().toLocaleDateString('en-CA'); 
  const getCurrentAbsentees = (classId) => {
    const record = attendanceData[classId];
    return (record && record.date === getTodayString()) ? (record.absent || []) : [];
  };

  const handleEnterClass = (classId) => {
    setActiveClassId(classId);
    setSelectedOutStudents([]); 
    setSelectedReturnIds([]);
    setView('dashboard');
  };

  const handleAdminLogin = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(adminPasswordInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const correctHash = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"; // 1234
      if (hashHex === correctHash) {
        setView('admin');
        setShowAdminLogin(false);
        setAdminPasswordInput('');
      } else {
        setGlobalModal({ type: 'alert', title: '密码错误 / Ralat', message: '密码不正确，请重试。\nKata laluan salah, sila cuba lagi.' });
      }
    } catch (e) {
      setGlobalModal({ type: 'alert', title: '系统错误', message: '验证过程出错，请确保使用现代浏览器（HTTPS环境）。' });
    }
  };

  const handleExportData = () => {
    const data = { classes, logs, attendanceData, assignedClassIds, isExamMode, backupDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SJKC_Log_Backup_${getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportClassLogsCSV = () => {
    const cls = getActiveClass();
    if (!cls) return;
    const classLogs = logs.filter(log => log.classId === activeClassId);
    let csvContent = "Date,Name,Time Out,Time In,Reason,Duration (Min)\n";
    classLogs.forEach(log => {
      const duration = log.timeIn ? Math.round((new Date(log.timeIn) - new Date(log.timeOut)) / 1000 / 60) : '';
      const safeName = `"${log.name}"`;
      const reason = log.reasonDisplay || log.reason;
      const row = `${formatDate(log.date)},${safeName},${formatTime(log.timeOut)},${formatTime(log.timeIn) || 'Still Out'},"${reason}",${duration}`;
      csvContent += row + "\n";
    });
    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls.name}_Logs_${getTodayString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if(!window.confirm("警告：恢复备份将覆盖当前所有数据！\nAwas: Data semasa akan diganti!")) { event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.classes) setClasses(data.classes);
        if (data.logs) setLogs(data.logs);
        if (data.attendanceData) setAttendanceData(data.attendanceData);
        if (data.assignedClassIds) setAssignedClassIds(data.assignedClassIds);
        if (data.isExamMode !== undefined) setIsExamMode(data.isExamMode);
        setGlobalModal({ type: 'alert', title: '恢复成功 / Berjaya', message: '数据已成功恢复！\nData berjaya dipulihkan.', onConfirm: () => window.location.reload() });
      } catch (err) {
        setGlobalModal({ type: 'alert', title: '错误 / Ralat', message: '文件格式错误！\nFormat fail salah!', isDanger: true });
      }
    };
    reader.readAsText(file);
  };

  const handleImportStudentCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r\n|\n/);
      const newStudents = lines.map(line => {
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const cleanParts = parts.map(p => p.replace(/^["']|["']$/g, '').trim()).filter(p => p);
          if (cleanParts.length === 0) return null;
          const rowStr = cleanParts.join(' ').toLowerCase();
          
          if ((rowStr.includes('bil') && rowStr.includes('nama')) || rowStr.includes('name') || rowStr.includes('姓名')) return null;

          let mixedName = null, cnName = null, myName = null;
          const isHeaderOrIrrelevant = (str) => {
             const s = str.toLowerCase();
             if (/^[\d\s\-\.\/]+$/.test(s) || s.length < 2) return true;
             return ['bil','no','id','name','nama','catatan'].some(k => s.startsWith(k));
          };

          for (const part of cleanParts) {
             if (isHeaderOrIrrelevant(part)) continue;
             const hasChinese = /[\u4e00-\u9fa5]/.test(part);
             const hasLatin = /[a-zA-Z]/.test(part);
             if (hasChinese && hasLatin) { if (!mixedName || part.length > mixedName.length) mixedName = part; }
             else if (hasChinese) { if (!cnName || part.length > cnName.length) cnName = part; }
             else if (hasLatin) { if (!myName || part.length > myName.length) { myName = part; } }
          }
          if (mixedName) return mixedName;
          if (cnName && myName) return `${myName} ${cnName}`; 
          if (cnName) return cnName;
          if (myName) return myName; 
          return null;
      }).filter(Boolean); 

      if (newStudents.length > 0) {
        const currentStudents = editingClass.students || [];
        const uniqueStudents = [...new Set([...currentStudents, ...newStudents])];
        setEditingClass({ ...editingClass, students: uniqueStudents });
        setGlobalModal({ type: 'alert', title: '导入成功', message: `成功导入 ${newStudents.length} 个名字。`, confirmText: 'OK' });
      } else {
        setGlobalModal({ type: 'alert', title: '无法导入', message: '未能识别出有效的名字。', isDanger: true });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; 
  };

  const handleAddClass = () => {
    const newClass = { id: Date.now().toString(), name: 'New Class', teacher: 'Guru Name', students: [] };
    setClasses([...classes, newClass]);
    setEditingClass(newClass);
  };

  const handleDeleteClass = (id) => {
    setGlobalModal({ type: 'confirm', title: '删除班级', message: '确定要删除这个班级吗？所有记录将丢失。', confirmText: '删除', isDanger: true, onConfirm: () => { setClasses(prev => prev.filter(c => c.id !== id)); setAssignedClassIds(prev => prev.filter(assignedId => assignedId !== id)); }});
  };

  const handleSaveClass = (updatedClass) => {
    const cleanedStudents = [...new Set(updatedClass.students.map(s => s.trim()).filter(s => s !== ""))];
    const finalClass = { ...updatedClass, students: cleanedStudents };
    setClasses(classes.map(c => c.id === finalClass.id ? finalClass : c));
    setEditingClass(null);
  };

  const handleSaveAttendance = (absentList) => {
    const today = getTodayString();
    setAttendanceData(prev => ({ ...prev, [activeClassId]: { date: today, absent: absentList } }));
    setGlobalModal({ type: 'alert', title: '保存成功', message: '今日缺席名单已更新。', confirmText: 'OK', onConfirm: () => setView('dashboard') });
  };

  const toggleTempAbsent = (name) => {
    if (tempAbsentees.includes(name)) setTempAbsentees(prev => prev.filter(n => n !== name));
    else setTempAbsentees(prev => [...prev, name]);
  };

  const toggleStudentSelection = (name) => {
    const isOut = logs.find(log => log.classId === activeClassId && log.name === name && !log.timeIn);
    if (isOut) { setGlobalModal({ type: 'alert', title: '无法选择', message: `${name} 已经在外面了` }); return; }
    if (selectedOutStudents.includes(name)) setSelectedOutStudents(prev => prev.filter(n => n !== name));
    else setSelectedOutStudents(prev => [...prev, name]);
  };

  const executeExit = (reasonObj, specificText = '') => {
    if (selectedOutStudents.length === 0) return;
    const finalReasonDisplay = specificText ? `${reasonObj.label} (${specificText})` : reasonObj.label;
    const finalReasonMy = specificText ? `${reasonObj.labelMy} (${specificText})` : reasonObj.labelMy;
    const newLogs = selectedOutStudents.map((name, index) => ({
      id: Date.now() + index, classId: activeClassId, date: new Date().toISOString(), name: name, timeOut: new Date().toISOString(), timeIn: null,
      reason: finalReasonMy, reasonDisplay: finalReasonDisplay, reasonId: reasonObj.id, note: specificText 
    }));
    setLogs([...newLogs, ...logs]);
    setView('dashboard');
    setSelectedOutStudents([]);
    setShowCustomReasonInput(false);
    setCustomReasonText('');
  };

  const handleConfirmExit = (reasonObj) => {
    if (reasonObj.id === 'lain') { setShowCustomReasonInput(true); return; }
    executeExit(reasonObj);
  };

  const submitCustomReason = () => {
    const lainReasonObj = REASONS.find(r => r.id === 'lain');
    executeExit(lainReasonObj, customReasonText);
  };

  const handleStudentReturn = (logId) => {
    const updatedLogs = logs.map(log => { if (log.id === logId) return { ...log, timeIn: new Date().toISOString() }; return log; });
    setLogs(updatedLogs);
    setConfirmReturnId(null);
  };

  const handleBatchReturn = () => {
    if (selectedReturnIds.length === 0) return;
    setGlobalModal({ type: 'confirm', title: '确认回来', message: `确认让选中的 ${selectedReturnIds.length} 名学生回来吗？`, confirmText: '确认', onConfirm: () => {
        const updatedLogs = logs.map(log => { if (selectedReturnIds.includes(log.id)) return { ...log, timeIn: new Date().toISOString() }; return log; });
        setLogs(updatedLogs);
        setSelectedReturnIds([]); 
      }
    });
  };

  const toggleReturnSelection = (logId) => {
    if (selectedReturnIds.includes(logId)) setSelectedReturnIds(prev => prev.filter(id => id !== logId));
    else setSelectedReturnIds(prev => [...prev, logId]);
  };

  const handleClearHistory = () => {
    setGlobalModal({ type: 'confirm', title: '清除记录', message: '确定要清除本班所有记录吗？', confirmText: '清除', isDanger: true, onConfirm: () => { setLogs(prev => prev.filter(l => l.classId !== activeClassId)); }});
  }

  const handleAssignClass = (classId) => { if (!classId || assignedClassIds.includes(classId)) return; setAssignedClassIds([...assignedClassIds, classId]); };
  const handleUnassignClass = (classId) => { setAssignedClassIds(assignedClassIds.filter(id => id !== classId)); };

  const renderGlobalModal = () => {
    if (!globalModal) return null;
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md text-center border border-white/20 transform scale-100 animate-in zoom-in-95 duration-200">
           <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md ${ globalModal.type === 'alert' ? 'bg-blue-50 text-blue-600' : globalModal.isDanger ? 'bg-red-50 text-red-600' : globalModal.title.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600' }`}>
             {globalModal.type === 'alert' && !globalModal.title.includes('成功') && <AlertCircle size={40} />}
             {globalModal.type === 'alert' && globalModal.title.includes('成功') && <CheckCircle size={40} />}
             {globalModal.type === 'confirm' && <AlertTriangle size={40} />}
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-2">{globalModal.title}</h3>
           <p className="text-lg text-slate-500 mb-8 whitespace-pre-line leading-relaxed">{globalModal.message}</p>
           <div className="flex gap-4">
             {globalModal.type === 'confirm' && ( <button onClick={() => setGlobalModal(null)} className="flex-1 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"> {globalModal.cancelText || '取消 / Batal'} </button> )}
             <button onClick={() => { if (globalModal.onConfirm) globalModal.onConfirm(); setGlobalModal(null); }} className={`flex-1 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${ globalModal.isDanger ? 'bg-red-600 hover:bg-red-700' : globalModal.type === 'alert' && !globalModal.title.includes('成功') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700' }`}> {globalModal.confirmText || '确定 / OK'} </button>
           </div>
        </div>
      </div>
    );
  };

  const renderCustomReasonModal = () => {
    if (!showCustomReasonInput) return null;
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-lg border border-slate-100 transform scale-100 animate-in zoom-in-95 duration-200">
           <div className="text-center mb-6">
             <div className="mx-auto bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center text-slate-600 mb-4 shadow-inner"><PenTool size={36} /></div>
             <h3 className="text-3xl font-bold text-slate-800 mb-2">具体原因 (可选)</h3>
             <p className="text-xl text-slate-500">Sebab Lain (Pilihan)</p>
           </div>
           
           {/* --- 新增：预设选项区域 --- */}
           <div className="grid grid-cols-2 gap-3 mb-6">
             {PRESET_OTHER_REASONS.map((preset) => (
               <button
                 key={preset.label}
                 onClick={() => {
                   const lainReasonObj = REASONS.find(r => r.id === 'lain');
                   executeExit(lainReasonObj, `${preset.label} / ${preset.labelMy}`);
                 }}
                 className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center gap-3 transition-all text-left group active:scale-95"
               >
                 <span className="text-2xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                 <div>
                   <div className="font-bold text-slate-700 text-sm leading-tight">{preset.label}</div>
                   <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{preset.labelMy}</div>
                 </div>
               </button>
             ))}
           </div>

           <div className="relative mb-6">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-slate-200"></div>
             </div>
             <div className="relative flex justify-center text-xs">
               <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-wider">或手动输入 / Atau taip manual</span>
             </div>
           </div>

           <input autoFocus type="text" value={customReasonText} onChange={(e) => setCustomReasonText(e.target.value)} placeholder="例如：去拿书 / Contoh: Ambil Buku" className="w-full p-5 text-xl bg-slate-50 border-2 border-slate-200 rounded-2xl mb-8 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" onKeyDown={(e) => { if (e.key === 'Enter') submitCustomReason(); }} />
           <button onClick={submitCustomReason} className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">确定 / Sahkan</button>
           <button onClick={() => { setShowCustomReasonInput(false); setCustomReasonText(''); }} className="w-full mt-4 py-3 text-slate-400 font-medium hover:text-slate-600">取消 / Batal</button>
        </div>
      </div>
    );
  };

  const renderLanding = () => {
    const visibleClasses = assignedClassIds.length > 0 ? classes.filter(c => assignedClassIds.includes(c.id)) : [];
    const gridClass = visibleClasses.length === 1 ? 'grid-cols-1 place-items-center' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 relative animate-in fade-in duration-300">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-6 right-6 z-10">
           <button onClick={() => setShowAdminLogin(true)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"><Settings size={20} /> <span className="text-sm font-medium">系统管理</span></button>
        </div>
        <div className="text-center mb-12 z-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-28 h-28 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl rotate-3 transform hover:rotate-6 transition-transform"><School size={56} /></div>
          <h1 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">新廊华小</h1>
          <p className="text-2xl text-slate-500 tracking-wide font-medium">电子出入记录系统 / Sistem Rekod Keluar Masuk Murid</p>
        </div>
        
        <div className={`grid gap-6 max-w-5xl w-full px-6 overflow-y-auto max-h-[60vh] pb-10 z-10 ${gridClass}`}>
          {visibleClasses.length > 0 ? (
            visibleClasses.map(cls => (
              <button key={cls.id} onClick={() => handleEnterClass(cls.id)} className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all group text-left relative overflow-hidden ${visibleClasses.length === 1 ? 'w-full max-w-md border-blue-200 ring-4 ring-blue-50' : ''}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-4"><h2 className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cls.name}</h2><ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" /></div>
                  <p className="text-slate-500 font-medium flex items-center gap-2"><Users size={16} /> {cls.teacher}</p>
                  <p className="text-slate-400 text-sm mt-2">{cls.students.length} 名学生 / Murid</p>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-300 text-slate-500 shadow-sm w-full max-w-lg mx-auto">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mb-6"><Monitor size={48} className="text-slate-400" /></div>
              <h3 className="text-2xl font-bold mb-3 text-slate-700">此设备尚未绑定班级</h3>
              <p className="mb-8 text-center text-lg leading-relaxed">为了正常使用，请进入“系统管理”<br/>设置此屏幕所显示的班级。</p>
              <button onClick={() => setShowAdminLogin(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1 active:translate-y-0">前往设置 / Setup</button>
            </div>
          )}
        </div>

        {showAdminLogin && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-slate-800">管理员登录</h3>
              <input type="password" placeholder="输入密码" className="w-full p-4 border-2 border-slate-100 rounded-2xl mb-4 text-lg focus:border-blue-500 focus:outline-none" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} />
              <div className="flex gap-3">
                <button onClick={() => {setShowAdminLogin(false); setAdminPasswordInput('');}} className="flex-1 py-3 text-slate-600 font-bold bg-slate-100 rounded-2xl hover:bg-slate-200">取消</button>
                <button onClick={handleAdminLogin} className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg">登录</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="h-full flex flex-col bg-slate-50 animate-in fade-in duration-300">
      <div className="bg-slate-800 text-white p-6 flex justify-between items-center shadow-lg shrink-0">
        <h2 className="text-2xl font-bold flex items-center gap-3"><Settings /> 新廊华小 - 后台管理</h2>
        <button onClick={() => setView('landing')} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-sm font-bold">退出</button>
      </div>
      <div className="flex-grow p-8 overflow-y-auto">
        {!editingClass && (
          <div className="bg-white max-w-4xl mx-auto rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 space-y-8">
            {/* New: System Control */}
             <div className="flex items-start gap-4 border-b border-slate-100 pb-8">
              <div className="bg-red-50 p-3 rounded-full text-red-600"><Lock size={32} /></div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-1">系统控制</h3>
                <p className="text-slate-500 text-sm mb-4">全局控制系统功能，如考试模式等。</p>
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isExamMode ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <AlertOctagon size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">考试模式 / Mod Peperiksaan</div>
                      <div className="text-sm text-slate-500">开启后将禁止学生外出。</div>
                    </div>
                  </div>
                  <button onClick={() => setIsExamMode(!isExamMode)} className={`px-6 py-2 rounded-lg font-bold transition-all ${isExamMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                    {isExamMode ? '已开启 / ON' : '已关闭 / OFF'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 border-b border-slate-100 pb-8">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Save size={32} /></div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-1">数据备份与恢复</h3>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-slate-500 text-sm">定期备份数据到电脑。</p>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">当前总记录: {logs.length}</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleExportData} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-colors"><Download size={18} /> 备份数据</button>
                  <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer"><Upload size={18} /> 恢复数据<input type="file" accept=".json" onChange={handleImportData} className="hidden" /></label>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Monitor size={32} /></div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-1">本设备绑定设置</h3>
                <p className="text-slate-500 text-sm mb-4">选择此屏幕显示的班级。可以绑定多个班级。</p>
                <div className="mb-4">
                  <select onChange={(e) => { handleAssignClass(e.target.value); e.target.value = ""; }} className="p-3 border-2 border-slate-200 rounded-xl font-medium text-slate-700 focus:border-blue-500 outline-none w-full max-w-md bg-white">
                    <option value="">+ 添加班级到此设备...</option>
                    {classes.map(cls => (<option key={cls.id} value={cls.id} disabled={assignedClassIds.includes(cls.id)}>{cls.name} {assignedClassIds.includes(cls.id) ? '(已添加)' : ''}</option>))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignedClassIds.length > 0 ? (
                    assignedClassIds.map(id => {
                      const cls = classes.find(c => c.id === id);
                      return cls ? (
                        <div key={id} className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-sm"><CheckCircle size={16} /> {cls.name}<button onClick={() => handleUnassignClass(id)} className="hover:bg-green-200 rounded-full p-1 transition-colors"><X size={16} /></button></div>
                      ) : null;
                    })
                  ) : (<span className="text-slate-400 italic text-sm">暂未绑定任何班级 (主页将不会显示班级)</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {editingClass ? (
          <div className="bg-white max-w-3xl mx-auto rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">编辑班级</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div><label className="block text-sm font-bold text-slate-500 mb-2">班级名称</label><input value={editingClass.name} onChange={e => setEditingClass({...editingClass, name: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl font-bold text-lg focus:border-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-500 mb-2">班主任</label><input value={editingClass.teacher} onChange={e => setEditingClass({...editingClass, teacher: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl font-bold text-lg focus:border-blue-500 outline-none" /></div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-slate-500">学生名单 (每行一个)</label>
                <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg transition-colors"><Upload size={16} /> 导入 CSV<input type="file" accept=".csv,.txt" onChange={handleImportStudentCSV} className="hidden" /></label>
              </div>
              <textarea value={editingClass.students.join('\n')} onChange={e => setEditingClass({...editingClass, students: e.target.value.split('\n')})} className="w-full h-64 p-4 border-2 border-slate-200 rounded-xl font-mono text-sm focus:border-blue-500 outline-none" placeholder="在此粘贴学生名单..." />
              <p className="text-xs text-slate-400 mt-2 text-right">共 {editingClass.students.filter(s => s.trim()).length} 名学生</p>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setEditingClass(null)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">取消</button>
              <button onClick={() => handleSaveClass(editingClass)} className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"><Save size={20} /> 保存修改</button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-slate-700">班级列表</h3>
               <button onClick={handleAddClass} className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-green-200/50 transition-all"><Plus size={20} /> 添加班级</button>
             </div>
             <div className="grid gap-4">
               {classes.map(cls => (
                 <div key={cls.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all">
                   <div>
                     <h4 className="text-xl font-bold text-slate-800">{cls.name}</h4>
                     <p className="text-slate-500">{cls.teacher} • {cls.students.length} murid</p>
                   </div>
                   <div className="flex gap-3">
                     <button onClick={() => setEditingClass(cls)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100">编辑</button>
                     <button onClick={() => handleDeleteClass(cls.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => {
    const cls = getActiveClass();
    if (!cls) return null;
    const activeLogs = logs.filter(log => log.classId === activeClassId && !log.timeIn);
    const absentees = getCurrentAbsentees(cls.id);
    const totalStudents = cls.students.length;
    const absentCount = absentees.length;
    const presentCount = totalStudents - absentCount;
    const attendancePercentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(2) : "0.00";

    return (
      <div className="flex flex-col h-full space-y-6 relative animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setView('landing')} className="bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 text-slate-600 transition-colors">
               <ChevronLeft size={24} />
             </button>
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">新廊华小</span>
                 {isExamMode && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse"><AlertOctagon size={12}/> 考试进行中</span>}
               </div>
               <h1 className="text-3xl font-bold text-slate-800">{cls.name}</h1>
               <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-lg">Guru: {cls.teacher}</span>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => { setTempAbsentees(getCurrentAbsentees(cls.id)); setView('attendance'); }}
                    className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors font-bold text-sm"
                  >
                    <UserX size={16} /> 点名
                  </button>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right hidden md:block">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">今日出席率</div>
               <div className="flex items-baseline justify-end gap-2">
                 <span className="text-4xl font-black text-slate-800">{presentCount}<span className="text-slate-300 text-2xl font-normal mx-1">/</span>{totalStudents}</span>
                 <span className={`text-lg font-bold ${parseFloat(attendancePercentage) === 100 ? 'text-green-500' : 'text-blue-500'}`}>({attendancePercentage}%)</span>
               </div>
               {absentCount > 0 && <div className="text-xs text-red-500 font-bold mt-1 bg-red-50 inline-block px-2 py-0.5 rounded-full">{absentCount} 缺席</div>}
            </div>
            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
            <div className="text-right">
              <div className="text-5xl font-mono font-bold text-blue-600 tracking-tight">
                {/* --- Modified: 12-hour format in Clock --- */}
                {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })}
              </div>
              <div className="text-slate-400 font-medium text-sm mt-1">
                {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow overflow-y-auto lg:overflow-hidden">
          {/* Exam Mode Lock Logic */}
          <div className={`bg-white rounded-3xl shadow-lg border-2 p-8 flex flex-col justify-center items-center space-y-8 relative overflow-hidden group transition-all select-none ${isExamMode ? 'border-slate-200 grayscale cursor-not-allowed' : 'border-blue-50 hover:border-blue-300 cursor-pointer'}`}
               onClick={() => { if (!isExamMode) { setSelectedOutStudents([]); setView('select-student'); } }}>
            {isExamMode ? (
              <>
                 <div className="bg-slate-100 text-slate-400 p-8 rounded-full shadow-inner mb-4">
                    <Lock size={80} />
                 </div>
                 <div className="text-center z-10">
                   <h2 className="text-4xl font-black text-slate-500 mb-3 tracking-tight">考试进行中</h2>
                   <p className="text-xl text-slate-400 font-medium">Peperiksaan Sedang Dijalankan</p>
                   <p className="text-sm text-red-400 mt-4 font-bold">外出功能已锁定 / Dikunci</p>
                 </div>
              </>
            ) : (
              <>
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LogOut size={240} className="text-blue-600" />
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-full shadow-2xl transform group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                  <LogOut size={80} />
                </div>
                <div className="text-center z-10">
                  <h2 className="text-5xl font-black text-slate-800 mb-3 tracking-tight">我要出去</h2>
                  <p className="text-2xl text-slate-500 font-medium">Saya Hendak Keluar</p>
                </div>
                <div className="w-full max-w-md bg-blue-50 text-blue-600 py-3 rounded-2xl text-center font-bold animate-pulse">
                  点击这里 / Tekan Sini
                </div>
              </>
            )}
          </div>

          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col relative overflow-hidden h-[500px] lg:h-auto">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeLogs.length > 0 ? 'bg-red-400' : 'bg-green-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${activeLogs.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </span>
                正在外面 ({activeLogs.length})
              </h2>
              {selectedReturnIds.length > 0 && (
                 <span className="text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-lg text-sm animate-pulse">
                   已选 {selectedReturnIds.length} 人
                 </span>
              )}
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-2 pb-20 custom-scrollbar">
              {activeLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <CheckCircle size={60} className="text-green-400" />
                  </div>
                  <p className="text-xl font-bold text-slate-500">全员在班</p>
                  <p className="text-sm">Semua murid di dalam kelas</p>
                </div>
              ) : (
                activeLogs.map(log => {
                   const reasonObj = REASONS.find(r => r.id === log.reasonId);
                   const displayReason = log.reasonDisplay || (reasonObj ? reasonObj.label : log.reason);
                   const isSelected = selectedReturnIds.includes(log.id);
                   const { cn, my } = parseName(log.name);
                   
                   // Auto Alert Logic: > 15 minutes
                   const durationMs = new Date() - new Date(log.timeOut);
                   const isOvertime = durationMs > 15 * 60 * 1000;

                   return (
                    <div key={log.id} onClick={() => toggleReturnSelection(log.id)}
                      className={`relative border-2 rounded-2xl p-4 shadow-sm flex justify-between items-center transition-all cursor-pointer select-none group ${
                        isSelected 
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 z-10' 
                        : isOvertime 
                          ? 'bg-red-50 border-red-300 animate-pulse' // Flashing red for overtime
                          : 'bg-white border-transparent hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="relative shrink-0">
                           <UserAvatar name={log.name} size="lg" />
                           <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                             <div className="text-lg">{reasonObj?.icon || '❓'}</div>
                           </div>
                        </div>
                        <div className="min-w-0">
                          {cn && <div className={`text-lg font-black leading-none mb-0.5 truncate ${isSelected ? 'text-blue-800' : isOvertime ? 'text-red-800' : 'text-slate-800'}`}>{cn}</div>}
                          <div className={`font-bold truncate leading-tight ${isSelected ? 'text-blue-700' : isOvertime ? 'text-red-600' : cn ? 'text-sm text-slate-500' : 'text-lg text-slate-800'}`}>
                            {my || log.name}
                          </div>
                          <div className={`font-medium flex items-center gap-2 text-md mt-1 ${isSelected ? 'text-blue-600' : isOvertime ? 'text-red-500' : 'text-slate-500'}`}>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-sm text-slate-600 shrink-0">{displayReason}</span>
                            <span className="text-red-400 font-mono text-sm shrink-0">{formatTime(log.timeOut)}</span>
                            {isOvertime && <span className="text-xs font-bold bg-red-100 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10}/> 很久</span>}
                          </div>
                        </div>
                      </div>
                      {!isSelected && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 shrink-0">
                          <LogIn size={24} />
                        </div>
                      )}
                      {isSelected && <CheckCircle size={28} className="text-blue-600 mr-2 shrink-0" />}
                    </div>
                   );
                })
              )}
            </div>

            {selectedReturnIds.length > 0 && (
               <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-4 duration-300 z-20">
                 <button onClick={handleBatchReturn} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 transform active:scale-95 transition-all">
                   <LogIn size={28} />
                   让选中的 {selectedReturnIds.length} 人回来
                 </button>
               </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center pt-2 gap-4 shrink-0">
          <button onClick={() => setView('history')} className="text-slate-400 hover:text-slate-600 flex items-center gap-2 px-6 py-3 rounded-full hover:bg-white hover:shadow-sm transition-all font-medium">
            <FileText size={20} />
            查看完整记录
          </button>
          <button onClick={() => setView('statistics')} className="text-blue-400 hover:text-blue-600 flex items-center gap-2 px-6 py-3 rounded-full hover:bg-white hover:shadow-sm transition-all font-medium">
            <BarChart3 size={20} />
            统计分析 / Analisis
          </button>
        </div>

        {confirmReturnId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 rounded-3xl animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-lg text-center border-4 border-green-100 transform scale-100 animate-in zoom-in-95 duration-200">
              <div className="mb-6">
                 <div className="mx-auto w-24 h-24 mb-4 relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                    <div className="bg-green-100 w-full h-full rounded-full flex items-center justify-center text-green-600 relative z-10">
                      <LogIn size={48} />
                    </div>
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800 mb-2">
                   {activeLogs.find(l => l.id === confirmReturnId)?.name}
                 </h3>
                 <p className="text-xl text-slate-500">已经回到班上了吗？</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setConfirmReturnId(null)} className="py-4 rounded-2xl text-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">还没 / Belum</button>
                <button onClick={() => handleStudentReturn(confirmReturnId)} className="py-4 rounded-2xl text-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg transform active:scale-95 transition-all">回来了 / Sudah</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSelectStudent = () => {
    const cls = getActiveClass();
    if (!cls) return null;
    const activeLogs = logs.filter(log => log.classId === activeClassId && !log.timeIn);
    const absentees = getCurrentAbsentees(cls.id);

    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right duration-300 relative">
        <div className="flex items-center mb-6 shrink-0">
          <button onClick={() => setView('dashboard')} className="bg-slate-100 p-3 rounded-full mr-4 hover:bg-slate-200 transition-colors">
            <ChevronLeft size={32} />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">你叫什么名字？</h2>
            <p className="text-slate-500 text-xl">Siapa nama anda? (Boleh pilih banyak)</p>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto pb-28 pr-2 custom-scrollbar">
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cls.students.map(name => {
              const isOut = activeLogs.find(log => log.name === name);
              const isAbsent = absentees.includes(name);
              const isSelected = selectedOutStudents.includes(name);
              const isDisabled = !!isOut || isAbsent;
              const { cn, my } = parseName(name);

              return (
                <button key={name} disabled={isDisabled} onClick={() => toggleStudentSelection(name)}
                  className={`p-4 rounded-2xl text-left shadow-sm border-2 transition-all active:scale-95 flex items-center gap-3 relative overflow-hidden group ${
                    isDisabled 
                      ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed grayscale' 
                      : isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg ring-2 ring-blue-200 transform scale-[1.02] z-10'
                        : 'bg-white border-slate-100 hover:border-blue-400 hover:shadow-md text-slate-700'
                  }`}
                >
                  <UserAvatar name={name} active={isSelected} />
                  <div className="flex-grow min-w-0">
                    {cn && <div className={`text-xl font-black leading-none mb-1 truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{cn}</div>}
                    <div className={`font-bold truncate leading-tight ${
                        isSelected 
                            ? 'text-blue-100' 
                            : cn 
                                ? 'text-xs text-slate-500 uppercase' 
                                : 'text-lg text-slate-800'
                    }`}>
                        {my || name}
                    </div>
                    {isOut && <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded inline-block mt-2">OUT</span>}
                    {isAbsent && <span className="text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded inline-block mt-2">缺席</span>}
                  </div>
                  {isSelected && <div className="absolute top-2 right-2 bg-white rounded-full text-blue-600 p-0.5"><CheckCircle size={16} /></div>}
                </button>
              );
            })}
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl z-20">
           <div className="flex items-center gap-3">
             <div className="bg-blue-100 text-blue-600 font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center">
               {selectedOutStudents.length}
             </div>
             <div className="text-slate-600 font-medium">已选人数<br/><span className="text-xs text-slate-400">Dipilih</span></div>
           </div>
           <button disabled={selectedOutStudents.length === 0} onClick={() => setView('select-reason')}
             className={`px-10 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all transform shadow-xl ${
               selectedOutStudents.length > 0 
                 ? 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1 active:scale-95' 
                 : 'bg-slate-200 text-slate-400 cursor-not-allowed'
             }`}
           >
             下一步 / Seterusnya <ArrowRight />
           </button>
        </div>
      </div>
    );
  };

  const renderSelectReason = () => (
    <div className="h-full flex flex-col items-center justify-center max-w-5xl mx-auto w-full animate-in slide-in-from-right duration-300">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          {selectedOutStudents.length > 1 ? `你们 ${selectedOutStudents.length} 人为什么出去？` : `${selectedOutStudents[0]} 为什么出去？`}
        </h2>
        <p className="text-slate-500 text-2xl">Kenapa hendak keluar?</p>
      </div>
      <div className="grid grid-cols-2 gap-6 w-full px-8">
        {REASONS.map(reason => (
          <button key={reason.id} onClick={() => handleConfirmExit(reason)}
            className={`
              ${reason.color} h-60 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all border-b-8 active:border-b-0 active:translate-y-2 group relative overflow-hidden
            `}
          >
            <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300">{reason.icon}</span>
            <div className="text-center z-10">
              <span className="block text-4xl font-bold">{reason.label}</span>
              <span className="block text-xl opacity-70 mt-1">{reason.labelMy}</span>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => setView('select-student')} className="mt-12 text-slate-400 text-lg hover:text-slate-600 underline font-medium">返回上一步</button>
    </div>
  );

  const renderHistory = () => {
    const cls = getActiveClass();
    const classLogs = logs.filter(log => log.classId === activeClassId); 
    return (
      <div className="h-full flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden animate-in fade-in duration-300">
        <div className="bg-slate-800 text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold">出入记录表</h2>
              <p className="text-slate-400 text-sm">Rekod Keluar Masuk - {cls?.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="text-sm bg-blue-500/20 hover:bg-blue-500 text-blue-200 hover:text-white px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-1">
               <Printer size={16}/> 打印
            </button>
            <button onClick={handleExportClassLogsCSV} className="text-sm bg-green-500/20 hover:bg-green-500 text-green-200 hover:text-white px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-1">
              <Download size={16} /> 导出
            </button>
            <button onClick={handleClearHistory} className="text-sm bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white px-4 py-2 rounded-xl transition-all font-bold">
              清空
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 border-b font-bold text-slate-500 w-24">日期</th>
                <th className="p-4 border-b font-bold text-slate-500">姓名</th>
                <th className="p-4 border-b font-bold text-slate-500 w-32">外出</th>
                <th className="p-4 border-b font-bold text-slate-500 w-32">回来</th>
                <th className="p-4 border-b font-bold text-slate-500 w-24 text-center">厕所</th>
                <th className="p-4 border-b font-bold text-slate-500">其他原因</th>
                <th className="p-4 border-b font-bold text-slate-500">时长</th>
              </tr>
            </thead>
            <tbody>
              {classLogs.length === 0 ? (
                <tr><td colSpan="7" className="p-12 text-center text-slate-400 italic">暂无记录</td></tr>
              ) : (
                classLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-500">{formatDate(log.date)}</td>
                    <td className="p-4 font-bold text-slate-700">{log.name}</td>
                    <td className="p-4 text-red-600 font-mono">{formatTime(log.timeOut)}</td>
                    <td className="p-4 text-green-600 font-mono">{log.timeIn ? formatTime(log.timeIn) : '-'}</td>
                    <td className="p-4 text-center">{log.reasonId === 'tandas' ? <CheckCircle size={20} className="mx-auto text-green-500" /> : ''}</td>
                    <td className="p-4 text-sm text-slate-600">{log.reasonId !== 'tandas' ? (log.reasonDisplay || log.reason) : ''}</td>
                    <td className="p-4 text-sm text-slate-400 italic">
                      {log.timeIn ? (() => {
                        const diff = Math.round((new Date(log.timeIn) - new Date(log.timeOut)) / 1000 / 60);
                        return `${diff} min`;
                      })() : '...'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    const cls = getActiveClass();
    if (!cls) return null;
    const absentees = getCurrentAbsentees(cls.id);
    const tempSet = new Set(tempAbsentees);

    return (
      <div className="h-full flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden animate-in fade-in duration-300">
        <div className="bg-slate-800 text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold">每日点名</h2>
              <p className="text-slate-400 text-sm">Kehadiran Murid - {cls.name}</p>
            </div>
          </div>
          <button onClick={() => handleSaveAttendance(tempAbsentees)} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2">
            <Save size={20} /> 保存 / Simpan
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 text-center text-blue-800 text-sm font-medium">
          请点击 <span className="text-red-600 font-bold">缺席</span> 的学生 / Sila tekan murid yang <span className="text-red-600 font-bold">TIDAK HADIR</span>
        </div>

        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cls.students.map(name => {
              const isAbsent = tempSet.has(name);
              const { cn, my } = parseName(name);
              
              return (
                <button key={name} onClick={() => toggleTempAbsent(name)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all active:scale-95 flex items-center gap-3 relative overflow-hidden ${
                    isAbsent 
                      ? 'bg-red-50 border-red-500 ring-2 ring-red-200' 
                      : 'bg-white border-slate-100 hover:border-blue-300'
                  }`}
                >
                  <UserAvatar name={name} active={isAbsent} />
                  <div className="min-w-0">
                    {cn && <div className={`text-lg font-black leading-none mb-1 truncate ${isAbsent ? 'text-red-800' : 'text-slate-800'}`}>{cn}</div>}
                    <div className={`font-bold truncate text-sm ${isAbsent ? 'text-red-600' : 'text-slate-500'}`}>
                        {my || name}
                    </div>
                    {isAbsent && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded inline-block mt-2">缺席 / TH</span>}
                  </div>
                  {isAbsent && <div className="absolute top-2 right-2 text-red-500"><CheckSquare size={20} /></div>}
                  {!isAbsent && <div className="absolute top-2 right-2 text-slate-200"><Square size={20} /></div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    const cls = getActiveClass();
    const classLogs = logs.filter(log => log.classId === activeClassId);

    // Filter Logic based on Time Scope
    const filteredLogs = classLogs; // Can extend to filter by date range later

    // --- Aggregation Logic ---
    const agg = {
      overview: {}, // By Date (Month/Year)
      timeOfDay: {}, // By Hour
      dayOfWeek: {}, // By Day (Mon, Tue...)
      duration: { total: 0, count: 0, longOut: [] } // Duration stats
    };

    filteredLogs.forEach(log => {
      const date = new Date(log.date);
      const timeOut = new Date(log.timeOut);
      
      // 1. Overview (Existing)
      let key, label, labelMy;
      if (statsView === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        label = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
        labelMy = date.toLocaleDateString('ms-MY', { year: 'numeric', month: 'long' });
      } else {
        key = `${date.getFullYear()}`;
        label = `${key} 年`;
        labelMy = `Tahun ${key}`;
      }
      if (!agg.overview[key]) agg.overview[key] = { label, labelMy, total: 0, reasons: {}, students: {} };
      agg.overview[key].total++;
      const rId = log.reasonId || 'lain';
      agg.overview[key].reasons[rId] = (agg.overview[key].reasons[rId] || 0) + 1;
      agg.overview[key].students[log.name] = (agg.overview[key].students[log.name] || 0) + 1;

      // 2. Time of Day
      const hour = timeOut.getHours();
      const timeLabel = `${String(hour).padStart(2,'0')}:00`;
      if (!agg.timeOfDay[timeLabel]) agg.timeOfDay[timeLabel] = 0;
      agg.timeOfDay[timeLabel]++;

      // 3. Day of Week
      const days = ['周日/Ahad', '周一/Isnin', '周二/Selasa', '周三/Rabu', '周四/Khamis', '周五/Jumaat', '周六/Sabtu'];
      const dayLabel = days[date.getDay()];
      if (!agg.dayOfWeek[dayLabel]) agg.dayOfWeek[dayLabel] = 0;
      agg.dayOfWeek[dayLabel]++;

      // 4. Duration
      if (log.timeIn) {
        const dur = (new Date(log.timeIn) - timeOut) / 1000 / 60; // mins
        agg.duration.total += dur;
        agg.duration.count++;
        if (dur > 20) { // Consider > 20 mins as "long"
           agg.duration.longOut.push({ ...log, duration: Math.round(dur) });
        }
      }
    });

    const sortedOverviewKeys = Object.keys(agg.overview).sort().reverse();
    const sortedTimeKeys = Object.keys(agg.timeOfDay).sort();
    // Fixed: Added Sunday and Saturday so weekend data is visible
    const sortedDayKeys = ['周日/Ahad', '周一/Isnin', '周二/Selasa', '周三/Rabu', '周四/Khamis', '周五/Jumaat', '周六/Sabtu'];

    return (
      <div className="h-full flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden animate-in fade-in duration-300">
        <div className="bg-slate-800 text-white p-6 flex flex-col md:flex-row justify-between items-center shrink-0 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setView('dashboard')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-xl transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold">统计分析</h2>
              <p className="text-slate-400 text-sm">Analisis Statistik - {cls?.name}</p>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
             {/* Sub Tabs */}
             <button onClick={() => setStatsTab('overview')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap ${statsTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
               <BarChart3 size={16}/> 概览
             </button>
             <button onClick={() => setStatsTab('time')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap ${statsTab === 'time' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
               <Clock size={16}/> 时段
             </button>
             <button onClick={() => setStatsTab('day')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap ${statsTab === 'day' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
               <CalendarDays size={16}/> 星期
             </button>
             <button onClick={() => setStatsTab('duration')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap ${statsTab === 'duration' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
               <Timer size={16}/> 时长
             </button>
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="flex-grow overflow-auto p-6 custom-scrollbar bg-slate-50">
           {filteredLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                 <BarChart3 size={60} className="mb-4 text-slate-300" />
                 <p className="text-xl font-bold">暂无统计数据</p>
                 <p>Tiada data statistik</p>
              </div>
           ) : (
             <>
               {/* Tab: Overview (Existing) */}
               {statsTab === 'overview' && (
                 <>
                    <div className="flex justify-end mb-6">
                      <div className="bg-white p-1 rounded-xl flex shadow-sm border border-slate-200">
                        <button onClick={() => setStatsView('monthly')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statsView === 'monthly' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>月度</button>
                        <button onClick={() => setStatsView('yearly')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statsView === 'yearly' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>年度</button>
                      </div>
                    </div>
                    {sortedOverviewKeys.length === 0 ? (
                      <div className="text-center text-slate-400 mt-20"><BarChart3 size={48} className="mx-auto mb-2 opacity-50"/>暂无数据</div>
                    ) : (
                      <div className="space-y-6">
                        {sortedOverviewKeys.map(key => {
                            const data = agg.overview[key];
                            const sortedStudents = Object.entries(data.students).sort((a,b) => b[1] - a[1]).slice(0, 3);
                            return (
                              <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                 <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
                                    <div><h3 className="text-2xl font-bold text-slate-800">{data.label}</h3><p className="text-slate-500 text-sm">{data.labelMy}</p></div>
                                    <div className="text-right"><div className="text-4xl font-black text-blue-600">{data.total}</div><div className="text-xs text-slate-400 font-bold uppercase">Total</div></div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><PieChart size={16}/> 原因分布</h4>
                                      <div className="space-y-2">{REASONS.map(r => (<div key={r.id} className="flex items-center text-xs"><div className="w-20 text-slate-500">{r.label}</div><div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full" style={{width: `${(data.reasons[r.id]||0)/data.total*100}%`}}></div></div><div className="w-8 text-right font-bold text-slate-700">{data.reasons[r.id]||0}</div></div>))}</div>
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><Users size={16}/> 高频学生</h4>
                                      <div className="space-y-2">{sortedStudents.map(([name, count], i) => (<div key={name} className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded"><span className="font-bold text-slate-700 truncate max-w-[150px]">{i+1}. {name}</span><span className="font-bold text-blue-600">{count}次</span></div>))}</div>
                                    </div>
                                 </div>
                              </div>
                            );
                        })}
                      </div>
                    )}
                 </>
               )}

               {/* Tab: Time of Day */}
               {statsTab === 'time' && (
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[400px]">
                   <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock className="text-blue-500"/> 时段分析 (Time Analysis)</h3>
                   <div className="flex items-end gap-4 h-64 mt-10 overflow-x-auto pb-4">
                     {sortedTimeKeys.map(time => {
                       const count = agg.timeOfDay[time];
                       const max = Math.max(...Object.values(agg.timeOfDay));
                       const height = `${(count / max) * 100}%`;
                       
                       // --- Modified: 12-hour format for Chart Labels ---
                       const [h] = time.split(':');
                       const hourInt = parseInt(h, 10);
                       const ampm = hourInt >= 12 ? 'PM' : 'AM';
                       const hour12 = hourInt % 12 || 12;
                       const displayTime = `${hour12} ${ampm}`;

                       return (
                         <div key={time} className="flex flex-col items-center group w-16 shrink-0">
                           <div className="relative w-full flex justify-center h-full items-end">
                             <div className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-200 transition-colors relative" style={{ height: height }}>
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-blue-600">{count}</div>
                             </div>
                           </div>
                           <div className="mt-2 text-sm font-bold text-slate-500 whitespace-nowrap">{displayTime}</div>
                         </div>
                       );
                     })}
                   </div>
                   <p className="text-center text-slate-400 mt-4 text-sm">显示每个小时的离开人次</p>
                 </div>
               )}

               {/* Tab: Day of Week */}
               {statsTab === 'day' && (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[400px]">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><CalendarDays className="text-green-500"/> 星期趋势 (Day Trends)</h3>
                    <div className="space-y-4 mt-8">
                      {sortedDayKeys.map(day => {
                        const count = agg.dayOfWeek[day] || 0;
                        const max = Math.max(...Object.values(agg.dayOfWeek), 1); // Avoid div by 0
                        const width = `${(count / max) * 100}%`;
                        return (
                          <div key={day} className="flex items-center gap-4">
                            <div className="w-24 font-bold text-slate-600 text-sm text-right">{day.split('/')[0]}</div>
                            <div className="flex-grow bg-slate-100 h-8 rounded-full overflow-hidden relative">
                               <div className="h-full bg-green-500 rounded-full flex items-center justify-end px-3 text-white font-bold text-xs transition-all duration-500" style={{ width: width }}>
                                 {count > 0 && count}
                               </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
               )}

               {/* Tab: Duration */}
               {statsTab === 'duration' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center py-10">
                          <div className="bg-orange-50 p-4 rounded-full text-orange-500 mb-4"><Timer size={40}/></div>
                          <div className="text-5xl font-black text-slate-800 mb-1">
                            {agg.duration.count > 0 ? Math.round(agg.duration.total / agg.duration.count) : 0} <span className="text-xl font-medium text-slate-400">min</span>
                          </div>
                          <div className="text-slate-500 font-bold">平均外出时长 / Purata Masa</div>
                       </div>
                       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center py-10">
                          <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4"><AlertOctagon size={40}/></div>
                          <div className="text-5xl font-black text-slate-800 mb-1">
                            {agg.duration.longOut.length} <span className="text-xl font-medium text-slate-400">次</span>
                          </div>
                          <div className="text-slate-500 font-bold">超时记录 ({'>'}20分钟)</div>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                       <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings className="text-slate-400"/> 超时详情列表</h4>
                       <div className="overflow-x-auto">
                         <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500">
                             <tr><th className="p-3 rounded-l-lg">学生</th><th className="p-3">原因</th><th className="p-3">时间</th><th className="p-3 rounded-r-lg">时长</th></tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             {agg.duration.longOut.length === 0 ? (
                               <tr><td colSpan={4} className="p-4 text-center text-slate-400">暂无超时记录，表现很好！</td></tr>
                             ) : (
                               agg.duration.longOut.map(l => (
                                 <tr key={l.id}>
                                   <td className="p-3 font-bold text-slate-700">{l.name}</td>
                                   <td className="p-3 text-slate-500">{l.reasonDisplay || l.reason}</td>
                                   <td className="p-3 text-slate-400">{formatDate(l.date)}</td>
                                   <td className="p-3 font-bold text-red-500">{l.duration} min</td>
                                 </tr>
                               ))
                             )}
                           </tbody>
                         </table>
                       </div>
                    </div>
                 </div>
               )}
             </>
           )}
        </div>
      </div>
    );
  }

  // --- 主渲染 ---
  return (
    <div className="bg-slate-200 h-screen w-full p-4 md:p-6 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border-8 border-white">
        {view === 'landing' && renderLanding()}
        {view === 'admin' && renderAdmin()}
        {view === 'dashboard' && renderDashboard()}
        {view === 'select-student' && renderSelectStudent()}
        {view === 'select-reason' && renderSelectReason()}
        {view === 'history' && renderHistory()}
        {view === 'attendance' && renderAttendance()}
        {view === 'statistics' && renderStatistics()}
        {renderGlobalModal()}
        {renderCustomReasonModal()}
      </div>
    </div>
  );
}