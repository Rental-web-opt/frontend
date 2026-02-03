// Layout sans Navbar pour les Dashboards Agency et Driver
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            {children}
        </div>
    );
}
