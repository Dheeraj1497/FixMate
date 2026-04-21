"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        expanded={sidebarExpanded}
        onClose={() => setSidebarOpen(false)}
        onToggleExpand={() => setSidebarExpanded((prev) => !prev)}
      />
      <div className={`h-screen min-w-0 flex flex-col overflow-hidden transition-[padding] duration-300 ${sidebarExpanded ? 'lg:pl-56' : 'lg:pl-16'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
