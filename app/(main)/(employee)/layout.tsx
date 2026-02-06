import './main-page-employee/MainPageEmployee.css'
import './my-page-employee/MyPageEmployee.css'
import './profile-employee/ProfileEmployee.css'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

