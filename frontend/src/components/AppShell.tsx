"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="h-screen overflow-hidden flex">
      <Sidebar
        open={sidebarOpen}
        expanded={sidebarExpanded}
        onClose={() => setSidebarOpen(false)}
        onToggleExpand={() => setSidebarExpanded((prev) => !prev)}
      />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
