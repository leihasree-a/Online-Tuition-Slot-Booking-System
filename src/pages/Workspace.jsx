import { useState, useEffect } from 'react'
import { LayoutDashboard, UsersRound, GraduationCap, CalendarDays, CalendarCheck, CreditCard, ClipboardCheck, Settings, LogOut, Bell, Search, Menu, Plus, ArrowUpRight, Clock3, BookOpen, Sparkles, Eye, EyeOff, X, Check, ChevronRight, SlidersHorizontal, TrendingUp, FileText, CircleHelp, MoreHorizontal } from 'lucide-react'
import Brand from '../components/Brand.jsx'
import { Avatar, Status, PageHeading, SearchBox, Select, Modal, EmptyState } from '../components/Ui.jsx'
import { students as seedStudents, tutors, bookings, payments, attendanceSeed, slots } from '../data/mockData.js'
import { mockService } from '../utils/mockService.js'
import { getAvailability } from '../utils/api.js'

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Students', icon: UsersRound }, { label: 'Tutors', icon: GraduationCap },
  { label: 'Availability', icon: CalendarDays }, { label: 'Bookings', icon: CalendarCheck }, { label: 'Payments', icon: CreditCard },
  { label: 'Attendance', icon: ClipboardCheck }, { label: 'Settings', icon: Settings },
]
const money = n => `₹${Number(n).toLocaleString('en-IN')}`
const today = '2026-10-08'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState('Dashboard')
  const [students, setStudents] = useState(seedStudents)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [modal, setModal] = useState(null)
  const [bookingList, setBookingList] = useState(bookings)
  const [payList, setPayList] = useState(payments)
  const [attendance, setAttendance] = useState(attendanceSeed)
  const [settings, setSettings] = useState({ email: true, reminders: true, compact: false })
  const notify = msg => { setToast(msg); window.clearTimeout(window._tuitionToast); window._tuitionToast = window.setTimeout(() => setToast(''), 2800) }
  const go = p => { setPage(p); setQuery(''); setMobileOpen(false) }

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />
  const filtered = items => items.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(query.toLowerCase())))
  const content = {
    Dashboard: <Dashboard bookings={bookingList} onGo={go} />,
    Students: <StudentsPage students={filtered(students)} allStudents={students} setStudents={setStudents} query={query} setQuery={setQuery} setModal={setModal} notify={notify} />,
    Tutors: <TutorsPage tutors={filtered(tutors)} query={query} setQuery={setQuery} />,
    Availability: <AvailabilityPage notify={notify} />,
    Bookings: <BookingsPage list={filtered(bookingList)} students={students} setBookingList={setBookingList} openBooking={() => setModal({ type: 'booking' })} showBooking={modal?.type === 'booking'} setModal={setModal} query={query} setQuery={setQuery} notify={notify} />,
    Payments: <PaymentsPage list={filtered(payList)} setPayList={setPayList} query={query} setQuery={setQuery} notify={notify} />,
    Attendance: <AttendancePage rows={attendance} setRows={setAttendance} notify={notify} />,
    Settings: <SettingsPage settings={settings} setSettings={setSettings} notify={notify} />,
  }[page]

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand /><button className="mobile-close icon-btn" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={`nav-link ${page === label ? 'active' : ''}`} onClick={() => go(label)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Bookings' && <span className="nav-count">4</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><CircleHelp size={17} /></span><strong>Need a hand?</strong><small>Visit our help centre</small><button onClick={() => notify('Help centre is coming soon')}>Get help <ArrowUpRight size={13} /></button></div><button className="nav-link logout" onClick={() => { setLoggedIn(false); setPage('Dashboard') }}><LogOut size={18} /><span>Log out</span></button><div className="side-user"><Avatar /><div><strong>Maya Chen</strong><small>Administrator</small></div><MoreHorizontal size={18} /></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21} /></button><span className="crumb">Workspace</span><ChevronRight size={14} /><strong>{page}</strong></div><div className="topbar-right"><button className="top-search" onClick={() => document.querySelector('.search-box input')?.focus()}><Search size={16} /><span>Search anything</span><kbd>⌘ K</kbd></button><div className="notification-wrap"><button className="icon-btn notification-btn" onClick={() => setNotifications(!notifications)} aria-label="Notifications"><Bell size={18} /><i /></button>{notifications && <div className="notification-pop"><strong>Notifications</strong><p><span className="notification-dot" />Your October fee report is ready.</p><p><span className="notification-dot muted" />2 classes are coming up today.</p><button onClick={() => setNotifications(false)}>Mark all as read</button></div>}</div><span className="top-divider" /><Avatar small /><div className="top-profile"><strong>Maya Chen</strong><small>Administrator</small></div></div></header>
      <div className="page-content" key={page}>{content}</div>
      <footer className="app-footer"><span>© 2026 TuitionHub</span><span>Manage learning. Simplify tuition.</span><span>Made for better learning <Sparkles size={13} /></span></footer>
    </main>
    {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    {modal?.type === 'student' && <StudentModal student={modal.student} onClose={() => setModal(null)} onSave={async row => { const saved = await mockService.saveStudent(row); setStudents(curr => modal.student ? curr.map(s => s.id === modal.student.id ? { ...s, ...saved } : s) : [saved, ...curr]); setModal(null); notify(modal.student ? 'Student profile updated' : 'Student added successfully') }} />}
    {modal?.type === 'delete' && <Modal title="Delete student?" onClose={() => setModal(null)}><p className="modal-copy">This will remove <b>{modal.student.name}</b> from the student list. This demo action only affects the current session.</p><div className="modal-actions"><button className="btn btn-quiet" onClick={() => setModal(null)}>Keep student</button><button className="btn btn-danger" onClick={() => { setStudents(curr => curr.filter(s => s.id !== modal.student.id)); setModal(null); notify('Student removed') }}>Delete student</button></div></Modal>}
  </div>
}

function Login({ onLogin }) {
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const submit = e => { e.preventDefault(); const d = new FormData(e.currentTarget); if (!d.get('email') || !d.get('password')) { setError('Enter your email and password to continue.'); return } onLogin() }
  return <div className="login-page"><div className="login-form-side"><div className="login-brand"><Brand /></div><form className="login-form" onSubmit={submit}><div className="eyebrow"><span /> YOUR LEARNING WORKSPACE</div><h1>Welcome back</h1><p className="login-intro">Sign in to manage your tuition workspace.</p>{error && <div className="form-error">{error}</div>}<label className="field-label">Email address<input name="email" type="email" placeholder="you@school.com" autoComplete="username" /></label><label className="field-label">Password<div className="password-input"><input name="password" type={show ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" /><button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><div className="login-options"><label className="check-label"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="text-link" onClick={() => setError('Password reset is a frontend demo. Contact your administrator.')}>Forgot password?</button></div><button className="btn btn-primary login-submit">Sign in <ArrowUpRight size={16} /></button><p className="register-line">New to TuitionHub? <button type="button" onClick={() => setError('Account registration will be available when your team connects the backend.')}>Create an account</button></p></form><div className="login-foot">© 2026 TuitionHub <span>·</span> Online Tuition Management System</div></div><div className="login-visual"><div className="visual-top"><span className="visual-tag"><span /> BUILT FOR BETTER LEARNING</span><span>01 <i>/</i> 03</span></div><div className="visual-copy"><span className="visual-kicker">A little more clarity, every day.</span><h2>Make room for<br />meaningful learning.</h2><p>One thoughtful space to bring students, tutors and every lesson together.</p></div><div className="lesson-card"><div className="lesson-top"><span className="lesson-icon"><BookOpen size={17} /></span><span className="lesson-live"><i /> NEXT LESSON</span><MoreHorizontal size={19} /></div><strong>Mathematics · Grade 10</strong><div className="lesson-bottom"><Avatar name="Priya Sharma" color="blue" small /><span>Priya Sharma <small>Today, 5:00 PM</small></span><span className="lesson-arrow"><ArrowUpRight size={15} /></span></div></div><div className="visual-note"><span>THOUGHTFULLY ORGANISED</span><span>01—04</span></div></div></div>
}

function Dashboard({ bookings: bookList, onGo }) {
  const metrics = [{ label: 'Total students', value: '128', detail: '+12 this month', icon: UsersRound, color: 'violet', trend: 'up' }, { label: 'Active tutors', value: '24', detail: 'Across 8 subjects', icon: GraduationCap, color: 'blue', trend: '' }, { label: 'Upcoming classes', value: '12', detail: 'Next 7 days', icon: CalendarDays, color: 'amber', trend: '' }, { label: 'Pending payments', value: '₹18,500', detail: 'Across 3 students', icon: CreditCard, color: 'green', trend: '' }]
  return <><div className="welcome-row"><div><div className="date-kicker">THURSDAY, OCTOBER 08, 2026</div><h1>Good morning, Maya <span>✳</span></h1><p>Here’s what’s happening across your tuition workspace.</p></div><button className="btn btn-secondary" onClick={() => onGo('Bookings')}><CalendarDays size={16} /> View schedule</button></div><section className="metric-grid">{metrics.map(({ label, value, detail, icon: Icon, color, trend }) => <article className="metric-card" key={label}><div className={`metric-icon ${color}`}><Icon size={19} /></div><div className="metric-label">{label}<button className="icon-btn metric-more" aria-label={`${label} details`}><MoreHorizontal size={18} /></button></div><strong className="metric-value">{value}</strong><div className="metric-detail">{trend && <span><TrendingUp size={13} /> 8.2%</span>}{detail}</div></article>)}</section><div className="dashboard-grid"><section className="panel upcoming-panel"><div className="panel-head"><div><div className="section-label">YOUR DAY AT A GLANCE</div><h2>Upcoming classes <span className="count-pill">{bookList.length}</span></h2></div><button className="link-button" onClick={() => onGo('Bookings')}>All bookings <ArrowUpRight size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>TUTOR</th><th>SUBJECT</th><th>DATE & TIME</th><th>STATUS</th></tr></thead><tbody>{bookList.slice(0, 4).map((b, i) => <tr key={i}><td><div className="person-cell"><Avatar name={b.student} color={['lilac', 'blue', 'peach', 'mint'][i]} small /><strong>{b.student}</strong></div></td><td>{b.tutor}</td><td>{b.subject}</td><td><span className="date-cell">{b.date}<small>{b.time}</small></span></td><td><Status>{b.status}</Status></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing <b>{Math.min(bookList.length, 4)}</b> of <b>{bookList.length}</b> bookings</span><button onClick={() => onGo('Bookings')}>View all <ArrowUpRight size={13} /></button></div></section><section className="panel weekly-panel"><div className="panel-head"><div><div className="section-label">THIS WEEK</div><h2>Learning rhythm</h2></div><button className="icon-btn" onClick={() => onGo('Availability')} aria-label="Open availability"><ArrowUpRight size={16} /></button></div><div className="weekly-total"><strong>32</strong><span>sessions this week <small><TrendingUp size={12} /> +4 from last week</small></span></div><div className="mini-chart" aria-label="Class sessions by day"><div className="chart-guides"><i /><i /><i /></div>{[4, 6, 3, 8, 5, 2, 1].map((v, i) => <div className="chart-col" key={i}><span className={i === 3 ? 'chart-bar selected' : 'chart-bar'} style={{ height: `${v * 11}px` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small></div>)}</div><button className="weekly-link" onClick={() => onGo('Availability')}>Explore availability <ArrowUpRight size={14} /></button></section></div><div className="dashboard-bottom"><section className="panel recent-panel"><div className="panel-head"><div><div className="section-label">LATEST ACTIVITY</div><h2>Recent bookings</h2></div><button className="link-button" onClick={() => onGo('Bookings')}>See all <ArrowUpRight size={14} /></button></div><div className="activity-list">{bookList.slice(0, 3).map((b, i) => <div className="activity-row" key={i}><span className={`activity-mark mark-${i}`}><CalendarCheck size={16} /></span><span className="activity-info"><strong>{b.student} <small>booked a session</small></strong><small>{b.subject} with {b.tutor}</small></span><span className="activity-time">{i === 0 ? '12 min ago' : `${i * 2 + 1}h ago`}</span></div>)}</div></section><section className="panel quick-panel"><div className="panel-head"><div><div className="section-label">SHORTCUTS</div><h2>Quick actions</h2></div><Sparkles size={17} className="quick-spark" /></div><div className="quick-grid"><QuickAction icon={Plus} label="Add a student" onClick={() => onGo('Students')} /><QuickAction icon={CalendarCheck} label="Book a class" onClick={() => onGo('Bookings')} /><QuickAction icon={CalendarDays} label="Check availability" onClick={() => onGo('Availability')} /><QuickAction icon={ClipboardCheck} label="Record attendance" onClick={() => onGo('Attendance')} /></div></section></div></>
}
function QuickAction({ icon: Icon, label, onClick }) { return <button className="quick-action" onClick={onClick}><span><Icon size={17} /></span>{label}<ArrowUpRight size={14} className="quick-arrow" /></button> }

function StudentsPage({ students, allStudents, setStudents, query, setQuery, setModal }) {
  const [status, setStatus] = useState('All students')
  const shown = students.filter(s => status === 'All students' || s.status === status)
  return <><PageHeading title="Students" subtitle="Manage student profiles and tuition information." action={<button className="btn btn-primary" onClick={() => setModal({ type: 'student' })}><Plus size={17} /> Add student</button>} /><div className="page-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Search students..." /><Select value={status} onChange={setStatus}><option>All students</option><option>Active</option><option>Inactive</option></Select><button className="btn btn-filter"><SlidersHorizontal size={16} /> Filters</button><span className="toolbar-count">{shown.length} students</span></div><section className="panel data-panel"><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>PHONE</th><th>GRADE</th><th>ASSIGNED TUTOR</th><th>STATUS</th><th></th></tr></thead><tbody>{shown.map(s => <tr key={s.id}><td><div className="person-cell"><Avatar name={s.name} color={s.color} small /><span><strong>{s.name}</strong><small>{s.email}</small></span></div></td><td className="id-cell">{s.id}</td><td>{s.phone}</td><td>{s.grade}</td><td>{s.tutor || '—'}</td><td><Status>{s.status}</Status></td><td><div className="row-actions"><button onClick={() => setModal({ type: 'student', student: s })} aria-label={`Edit ${s.name}`}>Edit</button><button className="delete-link" onClick={() => setModal({ type: 'delete', student: s })} aria-label={`Delete ${s.name}`}>Delete</button></div></td></tr>)}</tbody></table>{!shown.length && <EmptyState title="No students found" detail="Try changing your search or filters." />}</div><div className="table-footer"><span>Showing <b>{shown.length ? 1 : 0}–{shown.length}</b> of <b>{allStudents.length}</b> students</span><div className="pagination"><button disabled>‹</button><button className="current-page">1</button><button disabled>2</button><button disabled>›</button></div></div></section><div className="student-footnote"><span><span className="tiny-dot" /> Student information is for demo purposes</span><button onClick={() => setModal({ type: 'student' })}><Plus size={14} /> Add another student</button></div></>
}

function StudentModal({ student, onSave, onClose }) {
  const [error, setError] = useState('')
  return <Modal title={student ? 'Edit student' : 'Add a student'} onClose={onClose} wide><p className="modal-subtitle">{student ? 'Update this student’s profile details.' : 'Add a student profile to your tuition workspace.'}</p><form onSubmit={e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)); if (!d.name.trim() || !d.email.trim() || !d.grade.trim()) { setError('Name, email and grade are required.'); return } onSave({ ...d, ...(student || {}), name: d.name, email: d.email, phone: d.phone, grade: d.grade, tutor: d.tutor || 'Unassigned', status: d.status, initials: d.name.split(' ').map(x => x[0]).join('').slice(0, 2), color: student?.color || 'lilac' }) }}><div className="form-grid"><Field label="Student name" name="name" required defaultValue={student?.name} placeholder="e.g. Ananya Kumar" /><Field label="Student ID" name="id" defaultValue={student?.id} placeholder="Auto-generated if blank" /><Field label="Email address" name="email" type="email" required defaultValue={student?.email} placeholder="student@email.com" /><Field label="Phone number" name="phone" defaultValue={student?.phone} placeholder="+91 98765 43210" /><Field label="Date of birth" name="dob" type="date" /><Field label="Grade / class" name="grade" required defaultValue={student?.grade} placeholder="e.g. Grade 10" /><Field label="Parent / guardian" name="guardian" placeholder="Parent or guardian name" /><Field label="Assigned tutor" name="tutor" defaultValue={student?.tutor} placeholder="Choose a tutor" /><label className="field-label form-span">Address<input name="address" placeholder="Street, city, postal code" /></label><label className="field-label">Status<Select name="status" defaultValue={student?.status || 'Active'}><option>Active</option><option>Inactive</option></Select></label></div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button><button className="btn btn-primary"><Check size={15} /> {student ? 'Save changes' : 'Add student'}</button></div></form></Modal>
}
function Field({ label, name, type = 'text', ...props }) { return <label className="field-label">{label}{props.required && <span className="required"> *</span>}<input name={name} type={type} {...props} /></label> }

function TutorsPage({ tutors: shown, query, setQuery }) { return <><PageHeading title="Tutors" subtitle="Meet the educators supporting your students." action={<button className="btn btn-primary" onClick={() => window.alert('Tutor onboarding is a demo-only placeholder.')}><Plus size={17} /> Add tutor</button>} /><div className="page-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Search tutors or subjects..." /><Select defaultValue="All subjects"><option>All subjects</option><option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>English</option></Select><span className="toolbar-count">{shown.length} tutors</span></div><div className="tutor-grid">{shown.map(t => <article className="panel tutor-card" key={t.id}><div className="tutor-card-top"><Avatar name={t.name} color={t.color} /><button className="icon-btn" aria-label="Tutor actions"><MoreHorizontal size={19} /></button></div><div className="tutor-name-row"><h2>{t.name}</h2><span className="rating">★ {t.rating}</span></div><p className="tutor-subject">{t.subject}<span />{t.experience} experience</p><div className="tutor-divider" /><div className="tutor-details"><span><span className="detail-icon"><GraduationCap size={15} /></span>{t.id}</span><span><span className="detail-icon"><CalendarDays size={15} /></span>{t.availability}</span><span><span className="detail-icon"><BookOpen size={15} /></span>{t.email}</span></div><div className="tutor-card-foot"><Status>{t.status}</Status><button className="text-link" onClick={() => window.alert(`Contact ${t.name} at ${t.email}`)}>View profile <ArrowUpRight size={13} /></button></div></article>)}</div></> }

function AvailabilityPage({ notify }) {

    const [tutor, setTutor] = useState('1')
    const [date, setDate] = useState('2026-10-05')
    const [availability, setAvailability] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {

        async function loadAvailability() {

            setLoading(true)
            setError('')

            try {

                const data = await getAvailability(tutor)

                setAvailability(data)

            } catch (err) {

                console.error(err)
                setError('Could not load availability.')

            } finally {

                setLoading(false)
            }
        }

        loadAvailability()

    }, [tutor])


    const filteredSlots = availability.filter(
        slot => slot.date === date
    )


    return (
        <>
            <PageHeading
                title="Availability"
                subtitle="Explore tutor schedules and find a time that works."
            />

            <section className="panel availability-controls">

                <label className="field-label">
                    Select tutor

                    <Select
                        value={tutor}
                        onChange={e => setTutor(e.target.value)}
                    >
                        <option value="1">
                            Tutor 1
                        </option>
                    </Select>
                </label>


                <label className="field-label">
                    Choose a date

                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </label>

            </section>


            <section className="panel availability-panel">

                <div className="panel-head">

                    <div>

                        <div className="section-label">
                            DATABASE AVAILABILITY
                        </div>

                        <h2>
                            Available slots
                        </h2>

                    </div>

                </div>


                {loading && (
                    <p>
                        Loading availability...
                    </p>
                )}


                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}


                {!loading && !error && (
                    <div className="schedule-grid">

                        {filteredSlots.length === 0 ? (

                            <p>
                                No availability found for this date.
                            </p>

                        ) : (

                            filteredSlots.map(slot => (

                                <div
                                    key={slot.availabilityId}
                                    className="schedule-cell"
                                >

                                    <strong>
                                        {slot.startTime} - {slot.endTime}
                                    </strong>

                                    <span>
                                        {slot.status}
                                    </span>

                                </div>

                            ))

                        )}

                    </div>
                )}

            </section>
        </>
    )
}

function BookingsPage({ list, students, setBookingList, openBooking, showBooking, setModal, query, setQuery, notify }) { return <><PageHeading title="Bookings" subtitle="Coordinate lessons and keep every session on track." action={<button className="btn btn-primary" onClick={openBooking}><Plus size={17} /> Book a class</button>} /><div className="booking-summary"><div><span>UPCOMING SESSIONS</span><strong>{list.length.toString().padStart(2,'0')}</strong></div><div><span>THIS WEEK</span><strong>12</strong></div><div><span>NEEDS CONFIRMATION</span><strong>03</strong></div></div><div className="page-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Search bookings..." /><Select defaultValue="All statuses"><option>All statuses</option><option>Confirmed</option><option>Pending</option></Select><Select defaultValue="All dates"><option>All dates</option><option>This week</option><option>This month</option></Select><span className="toolbar-count">{list.length} bookings</span></div><section className="panel data-panel"><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>TUTOR</th><th>SUBJECT</th><th>DATE</th><th>TIME</th><th>STATUS</th><th></th></tr></thead><tbody>{list.map((b,i)=><tr key={i}><td><div className="person-cell"><Avatar name={b.student} color={['lilac','blue','peach','mint'][i%4]} small /><strong>{b.student}</strong></div></td><td>{b.tutor}</td><td>{b.subject}</td><td>{b.date}</td><td>{b.time}</td><td><Status>{b.status}</Status></td><td><button className="row-view" onClick={() => notify(`Booking for ${b.student}: ${b.subject}, ${b.date} at ${b.time}`)}>Details</button></td></tr>)}</tbody></table>{!list.length && <EmptyState title="No matching bookings" detail="Try a different search." />}</div><div className="table-footer"><span>Showing <b>{list.length}</b> sessions</span><span>Updated just now</span></div></section>{showBooking && <BookingModal onClose={() => setModal(null)} students={students} onSave={async b => { const saved=await mockService.saveBooking(b); setBookingList(curr => [saved,...curr]); notify('Class booked successfully') }} />}</> }

function BookingModal({ onClose, students, onSave }) {
  const [step, setStep] = useState(1)
  const [student, setStudent] = useState('Ananya Kumar')
  const [tutor, setTutor] = useState('Priya Sharma')
  const [subject, setSubject] = useState('Mathematics')
  const [date, setDate] = useState('2026-10-08')
  const [time, setTime] = useState('05:00 PM')
  const [success, setSuccess] = useState(false)
  return <Modal title={success ? 'You’re all set' : 'Book a class'} onClose={onClose} wide>{success ? <div className="success-state"><span className="success-icon"><Check size={27} /></span><h3>Class confirmed</h3><p>Your lesson has been added to the schedule.</p><div className="success-summary"><b>{student} with {tutor}</b><span>{subject} · {new Date(`${date}T12:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} · {time}</span><small>60 minutes</small></div><button className="btn btn-primary" onClick={onClose}>Done</button></div> : <><p className="modal-subtitle">Choose the details for this tutoring session.</p><div className="stepper">{['Student','Tutor & subject','Date & time','Confirm'].map((s,i)=><span key={s} className={`${step===i+1?'step-active':''} ${step>i+1?'step-done':''}`}><i>{step>i+1?<Check size={12}/>:i+1}</i>{s}</span>)}</div><div className="form-grid booking-fields">{step===1&&<><label className="field-label form-span">Select student<Select value={student} onChange={setStudent}>{students.map(s=><option key={s.id}>{s.name}</option>)}</Select></label><div className="booking-hint"><UsersRound size={16}/> Select the student this class is for.</div></>}{step===2&&<><label className="field-label">Tutor<Select value={tutor} onChange={setTutor}>{tutors.map(t=><option key={t.id}>{t.name}</option>)}</Select></label><label className="field-label">Subject<Select value={subject} onChange={setSubject}>{['Mathematics','Physics','Chemistry','English'].map(s=><option key={s}>{s}</option>)}</Select></label></>}{step===3&&<><label className="field-label">Date<input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} /></label><label className="field-label">Available time<Select value={time} onChange={setTime}>{slots.map(s=><option key={s}>{s}</option>)}</Select></label><div className="booking-hint"><Clock3 size={16}/> Session duration is 60 minutes.</div></>}{step===4&&<div className="confirm-card form-span"><span>BOOKING SUMMARY</span><p><small>Student</small><b>{student}</b></p><p><small>Tutor</small><b>{tutor}</b></p><p><small>Subject</small><b>{subject}</b></p><p><small>Date & time</small><b>{new Date(`${date}T12:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} · {time}</b></p><p><small>Duration</small><b>60 minutes</b></p></div>}</div><div className="modal-actions"><button className="btn btn-quiet" onClick={()=>step===1?onClose():setStep(step-1)}>{step===1?'Cancel':'Back'}</button><button className="btn btn-primary" onClick={()=>step<4?setStep(step+1):(onSave({student,tutor,subject,date,time,status:'Confirmed'}),setSuccess(true))}>{step===4?'Confirm booking':<>Continue <ChevronRight size={15}/></>}</button></div></>}</Modal>
}

function PaymentsPage({ list, setPayList, query, setQuery, notify }) { const totals = [{ title:'Total fees',value:'₹1,24,000',hint:'October 2026'},{title:'Paid',value:'₹96,000',hint:'77% collected'},{title:'Pending',value:'₹18,500',hint:'Due this month'},{title:'Overdue',value:'₹9,500',hint:'Needs attention'}]; return <><PageHeading title="Payments" subtitle="A clear overview of tuition fees and payment status." action={<button className="btn btn-secondary" onClick={()=>notify('Fee report exported (demo)')}><FileText size={15}/> Export report</button>} /><div className="payment-metrics">{totals.map((t,i)=><article className="panel payment-metric" key={t.title}><div><span>{t.title}</span><span className={`payment-dot payment-dot-${i}`} /></div><strong>{t.value}</strong><small>{t.hint}</small></article>)}</div><div className="page-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Search payments..."/><Select defaultValue="All statuses"><option>All statuses</option><option>Paid</option><option>Pending</option><option>Overdue</option></Select><span className="toolbar-count">{list.length} records</span></div><section className="panel data-panel"><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>FEE TYPE</th><th>AMOUNT</th><th>DUE DATE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{list.map((p,i)=><tr key={i}><td><div className="person-cell"><Avatar name={p.student} color={['lilac','blue','peach','mint'][i%4]} small /><strong>{p.student}</strong></div></td><td>{p.fee}</td><td className="amount-cell">{money(p.amount)}</td><td>{p.due}</td><td><Status>{p.status}</Status></td><td><button className="row-view" onClick={async()=>{ if(p.status!=='Paid'){const updated=await mockService.recordPayment(p);setPayList(curr=>curr.map(x=>x===p?updated:x));notify(`Payment recorded for ${p.student}`)} else notify(`${p.student}: ${p.fee}, ${money(p.amount)} · ${p.status}`)}}>{p.status==='Paid'?'View details':'Record payment'}</button></td></tr>)}</tbody></table>{!list.length&&<EmptyState title="No payments found" detail="Try a different search."/>}</div><div className="table-footer"><span>Showing <b>{list.length}</b> payment records</span><span>Amounts shown in INR</span></div></section><p className="demo-disclaimer"><CircleHelp size={14}/> Payment actions are UI demonstrations only. No money is collected or transferred.</p></> }

function AttendancePage({ rows, setRows, notify }) { const present = rows.filter(r=>r.status==='Present').length; const [date,setDate]=useState(today); const [className,setClassName]=useState('Grade 10 · Mathematics'); return <><PageHeading title="Attendance" subtitle="Keep a simple record of class participation." action={<button className="btn btn-secondary" onClick={()=>notify('Attendance sheet exported (demo)')}><FileText size={15}/> Export</button>} /><div className="attendance-overview"><div className="panel attendance-percent"><div><div className="section-label">TODAY’S ATTENDANCE</div><h2>Class participation</h2><p>Across the selected class and date.</p></div><div className="percent-ring" style={{'--percent':`${rows.length?Math.round(present/rows.length*100):0}%`}}><span><strong>{rows.length?Math.round(present/rows.length*100):0}%</strong><small>present</small></span></div><div className="attendance-legend"><span><i className="present-bg"/>Present <b>{present}</b></span><span><i className="absent-bg"/>Absent <b>{rows.filter(r=>r.status==='Absent').length}</b></span><span><i className="late-bg"/>Late <b>{rows.filter(r=>r.status==='Late').length}</b></span></div></div><div className="panel attendance-tip"><span className="tip-icon"><ClipboardCheck size={18}/></span><div><strong>A consistent routine makes a difference.</strong><p>Record attendance after each lesson to keep student progress up to date.</p></div><span className="tip-decoration">✳</span></div></div><section className="panel attendance-sheet"><div className="attendance-sheet-head"><div><div className="section-label">ATTENDANCE REGISTER</div><h2>Mark today’s class</h2></div><div className="attendance-filters"><label className="field-label">Class<Select value={className} onChange={setClassName}>{['Grade 10 · Mathematics','Grade 8 · Physics','Grade 12 · Chemistry'].map(c=><option key={c}>{c}</option>)}</Select></label><label className="field-label">Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div></div><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>CLASS</th><th>DATE</th><th>ATTENDANCE STATUS</th></tr></thead><tbody>{rows.map((r,i)=><tr key={r.student}><td><div className="person-cell"><Avatar name={r.student} color={['lilac','blue','peach','mint'][i%4]} small/><strong>{r.student}</strong></div></td><td>{className.split(' · ')[0]}</td><td>{new Date(`${date}T12:00:00`).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td><td><div className="attendance-options">{['Present','Absent','Late'].map(s=><button key={s} className={`attendance-choice ${s===r.status?'choice-'+s.toLowerCase():''}`} onClick={()=>setRows(curr=>curr.map(row=>row.student===r.student?{...row,status:s}:row))}>{s}</button>)}</div></td></tr>)}</tbody></table></div><div className="attendance-sheet-foot"><span>{rows.length} students · {present} present</span><button className="btn btn-primary" onClick={async()=>{await mockService.saveAttendance(rows);notify('Attendance saved for this demo session')}}><Check size={15}/> Save attendance</button></div></section></> }

function SettingsPage({ settings, setSettings, notify }) { const groups=[{title:'Profile',desc:'Manage your personal details and account information.',icon:UsersRound,action:'Edit profile'},{title:'Notifications',desc:'Choose how you’d like to hear about bookings and updates.',icon:Bell,toggles:[['Email updates','Receive important tuition updates by email.','email'],['Class reminders','Get reminders before upcoming classes.','reminders']]},{title:'Preferences',desc:'Set the details that make TuitionHub work for you.',icon:SlidersHorizontal,language:true},{title:'Appearance',desc:'Adjust the way your workspace looks on this device.',icon:Sparkles,toggles:[['Compact tables','Show more rows in student and booking lists.','compact']]}]; return <><PageHeading title="Settings" subtitle="Make your workspace feel like yours."/><div className="settings-layout"><nav className="settings-nav"><span className="section-label">YOUR WORKSPACE</span>{['Profile','Notifications','Preferences','Appearance'].map((s,i)=><button key={s} className={i===0?'settings-nav-active':''} onClick={()=>document.getElementById(`settings-${s}`)?.scrollIntoView({behavior:'smooth'})}>{[UsersRound,Bell,SlidersHorizontal,Sparkles].map((I,j)=>i===j?<I key={j} size={17}/>:null)}{s}<ChevronRight size={15}/></button>)}</nav><div className="settings-content">{groups.map((g,i)=><section className="panel settings-card" id={`settings-${g.title}`} key={g.title}><div className="settings-title"><span className="settings-icon"><g.icon size={18}/></span><div><h2>{g.title}</h2><p>{g.desc}</p></div>{g.action&&<button className="btn btn-secondary btn-sm" onClick={()=>notify('Profile editing is ready to connect to your backend')}>{g.action}</button>}</div>{g.toggles?.map(([name,desc,key])=><div className="setting-row" key={key}><span><strong>{name}</strong><small>{desc}</small></span><button role="switch" aria-checked={settings[key]} className={`toggle ${settings[key]?'on':''}`} onClick={()=>setSettings(s=>({...s,[key]:!s[key]}))}><i/></button></div>)}{g.language&&<div className="setting-row"><span><strong>Language & region</strong><small>Choose the language used in your workspace.</small></span><Select defaultValue="English (India)"><option>English (India)</option><option>English (UK)</option></Select></div>}</section>)}<div className="settings-save"><span>Changes are saved automatically on this device.</span><button className="btn btn-primary" onClick={()=>notify('Your preferences are up to date')}><Check size={15}/> Done</button></div></div></div></> }
