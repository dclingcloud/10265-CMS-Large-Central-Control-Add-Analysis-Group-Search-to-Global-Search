/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Monitor,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Settings,
  HelpCircle,
  ArrowLeft,
  Clock,
  Trash2,
  X,
  ArrowUpDown,
  Download,
  ExternalLink,
} from 'lucide-react';

interface InterfaceItem {
  id: string;
  name: string;
  selected: boolean;
}

interface ProbeItem {
  id: string;
  name: string;
  interfaces: InterfaceItem[];
}

interface AnalysisGroupItem {
  id: string;
  name: string;
  selected: boolean;
  ip: string;
  link: string;
  totalFlow: string;
  speed: string;
  packetCount: number;
  avgPacketRate: string;
  networkLatency: string;
  serverRespTime: string;
  status: string;
  startTime: string;
  lastUpdated: string;
  site: string;
}

interface AnalysisGroupCategory {
  id: 'interface' | 'vlan';
  name: string;
  groups: AnalysisGroupItem[];
}

interface ControllerNode {
  id: string;
  name: string;
  categories: AnalysisGroupCategory[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'host' | 'ip' | 'tcp' | 'udp'>('host');
  const [searchVal, setSearchVal] = useState('172.17.3.2');
  const [historySearchTag, setHistorySearchTag] = useState<string | null>('172.17.3.2');

  // Dropdown cascader open/close state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Column 1 active category: 'probe' (所有探针) or 'group' (分析组)
  const [activeMainCategory, setActiveMainCategory] = useState<'probe' | 'group'>('group');

  // Probes state (Level 1: 所有探针 -> Level 2: 探针IP -> Level 3: 接口)
  const [probes, setProbes] = useState<ProbeItem[]>([
    {
      id: 'probe-1',
      name: '172.17.3.87',
      interfaces: [
        { id: 'p1-int1', name: '接口1', selected: false },
        { id: 'p1-int2', name: '接口2', selected: false },
      ],
    },
    {
      id: 'probe-2',
      name: 'live55',
      interfaces: [
        { id: 'p2-int1', name: '接口1', selected: false },
        { id: 'p2-int2', name: '接口2', selected: false },
      ],
    },
    {
      id: 'probe-3',
      name: 'live56',
      interfaces: [{ id: 'p3-int1', name: '接口1', selected: false }],
    },
  ]);

  // Selected probe for column 2 when in 'probe' mode
  const [selectedProbeId, setSelectedProbeId] = useState<string>('probe-1');

  // Controllers state (Level 1: 分析组 -> Level 2: 3个中控 -> Level 3: 接口分析组/VLAN分析组 -> Level 4: 具备网络指标的分析组)
  const [controllers, setControllers] = useState<ControllerNode[]>([
    {
      id: 'ctrl-1',
      name: '中控1 (德胜DC)',
      categories: [
        {
          id: 'interface',
          name: '接口分析组',
          groups: [
            {
              id: 'c1-int-1',
              name: '德胜DC-P1到上海总部DC-P1',
              selected: true,
              ip: '172.17.3.2',
              link: 'Core Switch(V1003)',
              totalFlow: '13.11 MB',
              speed: '366.59 Kbps',
              packetCount: 33517,
              avgPacketRate: '111.72 pps',
              networkLatency: '4.09 ms',
              serverRespTime: '50.09 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:32.144030',
              lastUpdated: '2026-11-04 17:05:59.991396',
              site: 'Server172.17',
            },
            {
              id: 'c1-int-2',
              name: '德胜DC-P1到西安主中心DC-P1',
              selected: true,
              ip: '172.17.3.2',
              link: 'Business Zone 1(V1002)',
              totalFlow: '5.44 MB',
              speed: '152.01 Kbps',
              packetCount: 7194,
              avgPacketRate: '23.98 pps',
              networkLatency: '480.85 us',
              serverRespTime: '7.10 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:36.103100',
              lastUpdated: '2026-11-04 17:05:30.350960',
              site: 'Server172.17',
            },
            {
              id: 'c1-int-3',
              name: '稻香湖DC-P2到张江DC-P1',
              selected: true,
              ip: '172.17.3.2',
              link: 'Business Zone 2(V1004)',
              totalFlow: '4.90 MB',
              speed: '137.08 Kbps',
              packetCount: 9988,
              avgPacketRate: '33.29 pps',
              networkLatency: '4.16 ms',
              serverRespTime: '13.57 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:36.103985',
              lastUpdated: '2026-11-04 17:05:59.991397',
              site: 'Server172.17',
            },
            {
              id: 'c1-int-4',
              name: '稻香湖DC-P2到西安转接中心DC-P1',
              selected: true,
              ip: '172.17.3.2',
              link: 'Link LB(V1005)',
              totalFlow: '4.85 MB',
              speed: '135.55 Kbps',
              packetCount: 9944,
              avgPacketRate: '33.15 pps',
              networkLatency: '4.16 ms',
              serverRespTime: '13.75 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:36.103986',
              lastUpdated: '2026-11-04 17:05:59.991404',
              site: 'Server172.17',
            },
            {
              id: 'c1-int-5',
              name: '张江DC-P1到西安转接中心DC-P1',
              selected: false,
              ip: '172.17.3.2',
              link: 'TransLink(V1006)',
              totalFlow: '3.12 MB',
              speed: '98.40 Kbps',
              packetCount: 6120,
              avgPacketRate: '20.10 pps',
              networkLatency: '3.80 ms',
              serverRespTime: '11.20 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:40.100120',
              lastUpdated: '2026-11-04 17:05:58.120010',
              site: 'Server172.17',
            },
            {
              id: 'c1-int-6',
              name: '上海总部DC-P2到西安主中心DC-P1',
              selected: false,
              ip: '172.17.3.2',
              link: 'HQ Backbone(V1007)',
              totalFlow: '6.78 MB',
              speed: '189.20 Kbps',
              packetCount: 12400,
              avgPacketRate: '41.30 pps',
              networkLatency: '4.45 ms',
              serverRespTime: '14.80 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:45.300150',
              lastUpdated: '2026-11-04 17:05:59.400200',
              site: 'Server172.17',
            },
          ],
        },
        {
          id: 'vlan',
          name: 'VLAN分析组',
          groups: [
            {
              id: 'c1-vlan-1',
              name: '德胜DC-VLAN100_核心生产链路',
              selected: false,
              ip: '172.17.3.2',
              link: 'VLAN100_Prod',
              totalFlow: '18.40 MB',
              speed: '450.10 Kbps',
              packetCount: 41200,
              avgPacketRate: '137.33 pps',
              networkLatency: '2.10 ms',
              serverRespTime: '8.40 ms',
              status: '活跃',
              startTime: '2026-11-04 09:30:00.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
            },
          ],
        },
      ],
    },
    {
      id: 'ctrl-2',
      name: '中控2 (稻香湖DC)',
      categories: [
        {
          id: 'interface',
          name: '接口分析组',
          groups: [
            {
              id: 'c2-int-1',
              name: '稻香湖DC-P1到德胜DC-P1',
              selected: true,
              ip: '172.17.3.2',
              link: 'Core Switch(V1003)',
              totalFlow: '13.62 MB',
              speed: '380.91 Kbps',
              packetCount: 34100,
              avgPacketRate: '113.66 pps',
              networkLatency: '3.49 ms',
              serverRespTime: '52.04 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:32.144030',
              lastUpdated: '2026-11-04 17:05:59.991396',
              site: 'Server172.17',
            },
            {
              id: 'c2-int-2',
              name: '稻香湖DC-P1到上海总部DC-P2',
              selected: false,
              ip: '172.17.3.2',
              link: 'Business Zone 1(V1002)',
              totalFlow: '5.55 MB',
              speed: '155.19 Kbps',
              packetCount: 7300,
              avgPacketRate: '24.33 pps',
              networkLatency: '434.80 us',
              serverRespTime: '7.46 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:36.103100',
              lastUpdated: '2026-11-04 17:05:30.350960',
              site: 'Server172.17',
            },
            {
              id: 'c2-int-3',
              name: '稻香湖DC-P2到西安主中心DC-P2',
              selected: false,
              ip: '172.17.3.2',
              link: 'Business Zone 2(V1004)',
              totalFlow: '2.80 MB',
              speed: '78.31 Kbps',
              packetCount: 5120,
              avgPacketRate: '17.06 pps',
              networkLatency: '9.63 ms',
              serverRespTime: '15.10 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:36.103985',
              lastUpdated: '2026-11-04 17:05:59.991397',
              site: 'Server172.17',
            },
          ],
        },
        {
          id: 'vlan',
          name: 'VLAN分析组',
          groups: [
            {
              id: 'c2-vlan-1',
              name: '稻香湖DC-VLAN10_数据交换专网',
              selected: false,
              ip: '172.17.3.2',
              link: 'VLAN10_Exchange',
              totalFlow: '9.20 MB',
              speed: '230.40 Kbps',
              packetCount: 18400,
              avgPacketRate: '61.33 pps',
              networkLatency: '3.10 ms',
              serverRespTime: '12.80 ms',
              status: '活跃',
              startTime: '2026-11-04 09:32:10.000000',
              lastUpdated: '2026-11-04 17:05:58.000000',
              site: 'Server172.17',
            },
          ],
        },
      ],
    },
    {
      id: 'ctrl-3',
      name: '中控3 (张江DC)',
      categories: [
        {
          id: 'interface',
          name: '接口分析组',
          groups: [
            {
              id: 'c3-int-1',
              name: '张江DC-P1到上海总部DC-P1',
              selected: false,
              ip: '172.17.3.2',
              link: 'Core Switch(V1003)',
              totalFlow: '14.20 MB',
              speed: '390.10 Kbps',
              packetCount: 35600,
              avgPacketRate: '118.66 pps',
              networkLatency: '2.80 ms',
              serverRespTime: '45.10 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:30.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
            },
            {
              id: 'c3-int-2',
              name: '张江DC-P1到德胜DC-P2',
              selected: false,
              ip: '172.17.3.2',
              link: 'Backup Sync(V2005)',
              totalFlow: '7.20 MB',
              speed: '180.12 Kbps',
              packetCount: 12040,
              avgPacketRate: '40.13 pps',
              networkLatency: '5.12 ms',
              serverRespTime: '35.60 ms',
              status: '活跃',
              startTime: '2026-11-04 09:38:22.341100',
              lastUpdated: '2026-11-04 17:05:57.432190',
              site: 'Server172.17',
            },
          ],
        },
        {
          id: 'vlan',
          name: 'VLAN分析组',
          groups: [
            {
              id: 'c3-vlan-1',
              name: '张江DC-VLAN101_金融交易通道',
              selected: false,
              ip: '172.17.3.2',
              link: 'VLAN101_Finance',
              totalFlow: '22.10 MB',
              speed: '580.30 Kbps',
              packetCount: 52100,
              avgPacketRate: '173.66 pps',
              networkLatency: '1.45 ms',
              serverRespTime: '6.20 ms',
              status: '活跃',
              startTime: '2026-11-04 09:30:10.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
            },
          ],
        },
      ],
    },
  ]);

  // Active controller for the cascader in Column 2
  const [selectedControllerId, setSelectedControllerId] = useState<string>('ctrl-1');
  const [selectedGroupCategoryId, setSelectedGroupCategoryId] = useState<'interface' | 'vlan'>('interface');

  // Multi-controller Result Tab State (Tab switching between selected controllers)
  const [activeResultCtrlId, setActiveResultCtrlId] = useState<string>('ctrl-1');

  // Table row multi-selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Sorting
  const [sortField, setSortField] = useState<keyof AnalysisGroupItem>('totalFlow');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Helper functions for clearing (mutual exclusion)
  const clearAllProbes = () => {
    setProbes((prev) =>
      prev.map((probe) => ({
        ...probe,
        interfaces: probe.interfaces.map((i) => ({ ...i, selected: false })),
      }))
    );
  };

  const clearAllAnalysisGroups = () => {
    setControllers((prev) =>
      prev.map((ctrl) => ({
        ...ctrl,
        categories: ctrl.categories.map((cat) => ({
          ...cat,
          groups: cat.groups.map((g) => ({ ...g, selected: false })),
        })),
      }))
    );
  };

  // Metrics: Selected counts
  const totalSelectedLinks = probes.reduce(
    (acc, probe) => acc + probe.interfaces.filter((i) => i.selected).length,
    0
  );

  const totalSelectedGroups = controllers.reduce(
    (acc, ctrl) =>
      acc +
      ctrl.categories.reduce(
        (catAcc, cat) => catAcc + cat.groups.filter((g) => g.selected).length,
        0
      ),
    0
  );

  // Probe status
  const totalInterfaces = probes.reduce((acc, probe) => acc + probe.interfaces.length, 0);
  const isAllProbesSelected = totalSelectedLinks === totalInterfaces && totalInterfaces > 0;
  const isAllProbesIndeterminate = totalSelectedLinks > 0 && totalSelectedLinks < totalInterfaces;

  // Analysis group status across all 3 controllers
  const totalAnalysisGroups = controllers.reduce(
    (acc, ctrl) =>
      acc + ctrl.categories.reduce((catAcc, cat) => catAcc + cat.groups.length, 0),
    0
  );
  const isAllGroupsSelected = totalSelectedGroups === totalAnalysisGroups && totalAnalysisGroups > 0;
  const isAllGroupsIndeterminate = totalSelectedGroups > 0 && totalSelectedGroups < totalAnalysisGroups;

  // Active probe for column 3 (in probe mode)
  const activeProbe = probes.find((p) => p.id === selectedProbeId) || probes[0];

  // Active controller & active category (in cascader group mode)
  const activeController = controllers.find((c) => c.id === selectedControllerId) || controllers[0];
  const activeCategory =
    activeController.categories.find((c) => c.id === selectedGroupCategoryId) ||
    activeController.categories[0];

  // Controllers that currently have selected analysis groups
  const controllersWithSelectedGroups = useMemo(() => {
    return controllers.filter((ctrl) =>
      ctrl.categories.some((cat) => cat.groups.some((g) => g.selected))
    );
  }, [controllers]);

  // Keep activeResultCtrlId valid
  useEffect(() => {
    if (controllersWithSelectedGroups.length > 0) {
      const exists = controllersWithSelectedGroups.some((c) => c.id === activeResultCtrlId);
      if (!exists) {
        setActiveResultCtrlId(controllersWithSelectedGroups[0].id);
      }
    }
  }, [controllersWithSelectedGroups, activeResultCtrlId]);

  // Currently displayed result controller
  const currentResultCtrl =
    controllers.find((c) => c.id === activeResultCtrlId) || controllersWithSelectedGroups[0] || controllers[0];

  // Groups under current result controller that are selected (or all if none explicitly selected)
  const currentResultGroups = useMemo(() => {
    const allGroupsInCtrl = currentResultCtrl.categories.flatMap((cat) => cat.groups);
    const selected = allGroupsInCtrl.filter((g) => g.selected);
    const list = selected.length > 0 ? selected : allGroupsInCtrl;

    // Filter by searchVal if applicable
    const filtered = searchVal.trim()
      ? list.filter((g) => g.ip.includes(searchVal.trim()) || g.name.includes(searchVal.trim()))
      : list;

    // Sort
    return [...filtered].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [currentResultCtrl, searchVal, sortField, sortAsc]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Mutual exclusion handlers
  const handleToggleAllProbes = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllAnalysisGroups();
    const shouldSelect = totalSelectedLinks === 0;
    setProbes((prev) =>
      prev.map((probe) => ({
        ...probe,
        interfaces: probe.interfaces.map((intf) => ({ ...intf, selected: shouldSelect })),
      }))
    );
  };

  const handleToggleProbe = (probeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllAnalysisGroups();
    setProbes((prev) =>
      prev.map((probe) => {
        if (probe.id === probeId) {
          const hasUnselected = probe.interfaces.some((i) => !i.selected);
          return {
            ...probe,
            interfaces: probe.interfaces.map((i) => ({ ...i, selected: hasUnselected })),
          };
        }
        return probe;
      })
    );
  };

  const handleToggleInterface = (probeId: string, interfaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllAnalysisGroups();
    setProbes((prev) =>
      prev.map((probe) => {
        if (probe.id === probeId) {
          return {
            ...probe,
            interfaces: probe.interfaces.map((i) =>
              i.id === interfaceId ? { ...i, selected: !i.selected } : i
            ),
          };
        }
        return probe;
      })
    );
  };

  const handleToggleAllGroups = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllProbes();
    const shouldSelect = totalSelectedGroups === 0;
    setControllers((prev) =>
      prev.map((ctrl) => ({
        ...ctrl,
        categories: ctrl.categories.map((cat) => ({
          ...cat,
          groups: cat.groups.map((g) => ({ ...g, selected: shouldSelect })),
        })),
      }))
    );
  };

  const handleToggleController = (ctrlId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllProbes();
    setControllers((prev) =>
      prev.map((ctrl) => {
        if (ctrl.id === ctrlId) {
          const allGroups = ctrl.categories.flatMap((c) => c.groups);
          const hasUnselected = allGroups.some((g) => !g.selected);
          return {
            ...ctrl,
            categories: ctrl.categories.map((cat) => ({
              ...cat,
              groups: cat.groups.map((g) => ({ ...g, selected: hasUnselected })),
            })),
          };
        }
        return ctrl;
      })
    );
  };

  const handleToggleGroupCategory = (catId: 'interface' | 'vlan', e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllProbes();
    setControllers((prev) =>
      prev.map((ctrl) => {
        if (ctrl.id === selectedControllerId) {
          return {
            ...ctrl,
            categories: ctrl.categories.map((cat) => {
              if (cat.id === catId) {
                const hasUnselected = cat.groups.some((g) => !g.selected);
                return {
                  ...cat,
                  groups: cat.groups.map((g) => ({ ...g, selected: hasUnselected })),
                };
              }
              return cat;
            }),
          };
        }
        return ctrl;
      })
    );
  };

  const handleToggleGroupItem = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearAllProbes();
    setControllers((prev) =>
      prev.map((ctrl) => {
        if (ctrl.id === selectedControllerId) {
          return {
            ...ctrl,
            categories: ctrl.categories.map((cat) => {
              if (cat.id === selectedGroupCategoryId) {
                return {
                  ...cat,
                  groups: cat.groups.map((g) =>
                    g.id === groupId ? { ...g, selected: !g.selected } : g
                  ),
                };
              }
              return cat;
            }),
          };
        }
        return ctrl;
      })
    );
  };

  // Close tab in result view (unselects all groups in that controller)
  const handleCloseResultTab = (ctrlId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setControllers((prev) =>
      prev.map((c) => {
        if (c.id === ctrlId) {
          return {
            ...c,
            categories: c.categories.map((cat) => ({
              ...cat,
              groups: cat.groups.map((g) => ({ ...g, selected: false })),
            })),
          };
        }
        return c;
      })
    );
  };

  // Table row selection toggles
  const handleSelectAllRows = () => {
    if (selectedRowIds.length === currentResultGroups.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(currentResultGroups.map((g) => g.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Sort toggle
  const handleSort = (field: keyof AnalysisGroupItem) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans select-none">
      {/* Left Sidebar */}
      <aside className="w-[208px] shrink-0 bg-[#262930] text-gray-200 flex flex-col justify-between select-none z-20">
        <div>
          {/* Logo / System Title */}
          <div className="h-[48px] flex items-center px-4 font-bold text-white text-[15px] tracking-wide">
            <span>统一管理平台</span>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-1 space-y-0.5 text-[13px]">
            {/* 全局搜索 */}
            <div className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:text-white hover:bg-[#2f343e] cursor-default transition-colors">
              <Search className="w-4 h-4 text-gray-300 stroke-[1.8]" />
              <span>全局搜索</span>
            </div>

            {/* 大屏 */}
            <div className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:text-white hover:bg-[#2f343e] cursor-default transition-colors">
              <Monitor className="w-4 h-4 text-gray-300 stroke-[1.8]" />
              <span>大屏</span>
            </div>

            {/* UCM分组 (Expanded) */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 text-gray-200 hover:text-white hover:bg-[#2f343e] cursor-default transition-colors">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-gray-300 stroke-[1.8]" />
                  <span>UCM分组</span>
                </div>
                <ChevronUp className="w-3.5 h-3.5 text-gray-400 stroke-[2]" />
              </div>

              {/* Submenu items */}
              <div className="bg-[#1e2127] py-1 text-[13px]">
                <div className="pl-11 pr-4 py-2 text-gray-200 hover:text-white hover:bg-[#282d37] cursor-default transition-colors">
                  总览
                </div>
                <div className="pl-11 pr-4 py-2 text-gray-200 hover:text-white hover:bg-[#282d37] cursor-default transition-colors">
                  探针分组
                </div>
              </div>
            </div>

            {/* 配置 (Collapsed) */}
            <div className="flex items-center justify-between px-4 py-2 text-gray-200 hover:text-white hover:bg-[#2f343e] cursor-default transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gray-300 stroke-[1.8]" />
                <span>配置</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 stroke-[2]" />
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="h-10 px-4 flex items-center justify-between border-t border-[#313640] text-gray-400">
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-default stroke-[1.8]" />
          <ArrowLeft className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-default stroke-[1.8]" />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-white">
        {/* Top Header Bar */}
        <header className="h-[48px] shrink-0 bg-[#262930] flex items-center justify-end px-6 text-xs text-gray-300 select-none">
          <div className="flex items-center gap-1.5 cursor-default hover:text-white">
            <span className="text-gray-400">欢迎您</span>
            <span className="text-white font-normal ml-0.5">admin</span>
            <ChevronDown className="w-3 h-3 text-gray-400 stroke-[2] ml-0.5" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 pt-5 relative">
          {/* Top-Right "高级配置" button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#d9d9d9] rounded-sm text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-default"
            >
              <svg
                className="w-3.5 h-3.5 text-slate-500"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <circle cx="8" cy="8" r="2.5" />
                <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
              </svg>
              <span>高级配置</span>
            </button>
          </div>

          {/* Search Module Area */}
          <div className="mt-2 max-w-[1400px]" ref={dropdownRef}>
            {/* Top Row: Date/Time range + quick filter action pills */}
            <div className="flex items-center justify-between">
              {/* Date/Time picker box */}
              <div className="inline-flex items-center gap-2 bg-[#fcfcfd] border border-[#e2e5ec] rounded-xs px-3 py-1.5 text-xs text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
                <span className="tabular-nums">2026-11-04 16:31</span>
                <span className="text-slate-500 mx-1">至</span>
                <span className="tabular-nums">2026-11-04 16:36</span>
              </div>

              {/* Right indicators */}
              <div className="flex items-center gap-2.5">
                {/* 指标选择 */}
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 bg-[#f4f5f7] border border-[#e4e7ed] px-2.5 py-1 text-xs text-slate-700 rounded-xs hover:bg-[#ebedf1] transition-colors cursor-default"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="1.5" fill="#E0F2FE" />
                    <rect x="4" y="8" width="2" height="4" fill="#0284C7" />
                    <rect x="7" y="5" width="2" height="7" fill="#F59E0B" />
                    <rect x="10" y="7" width="2" height="5" fill="#10B981" />
                  </svg>
                  <span>指标选择</span>
                </button>

                {/* 精确过滤 */}
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 bg-[#f4f5f7] border border-[#e4e7ed] px-2.5 py-1 text-xs text-slate-700 rounded-xs hover:bg-[#ebedf1] transition-colors cursor-default"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#0091ff]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <circle cx="8" cy="8" r="5" />
                    <line x1="8" y1="1.5" x2="8" y2="4.5" />
                    <line x1="8" y1="11.5" x2="8" y2="14.5" />
                    <line x1="1.5" y1="8" x2="4.5" y2="8" />
                    <line x1="11.5" y1="8" x2="14.5" y2="8" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                  <span>精确过滤</span>
                </button>
              </div>
            </div>

            {/* Middle Row: Tabs */}
            <div className="mt-4 flex items-end">
              <button
                type="button"
                onClick={() => setActiveTab('host')}
                className={`px-5 py-1.5 text-xs font-normal rounded-t-xs cursor-default transition-colors ${
                  activeTab === 'host'
                    ? 'bg-[#0091ff] text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                主机
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ip')}
                className={`px-5 py-1.5 text-xs font-normal rounded-t-xs cursor-default transition-colors ${
                  activeTab === 'ip'
                    ? 'bg-[#0091ff] text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                IP会话
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tcp')}
                className={`px-5 py-1.5 text-xs font-normal rounded-t-xs cursor-default transition-colors ${
                  activeTab === 'tcp'
                    ? 'bg-[#0091ff] text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                TCP会话
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('udp')}
                className={`px-5 py-1.5 text-xs font-normal rounded-t-xs cursor-default transition-colors ${
                  activeTab === 'udp'
                    ? 'bg-[#0091ff] text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                UDP会话
              </button>
            </div>

            {/* Bottom Row: Unified Search Input with bright blue outline */}
            <div className="relative">
              <div
                className={`border border-[#0091ff] bg-white flex items-center h-10 w-full transition-all ${
                  isDropdownOpen ? 'rounded-tr-xs' : 'rounded-b-xs rounded-tr-xs'
                }`}
              >
                {/* Left Selector: Link / Analysis Group Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3.5 h-full text-xs text-slate-800 shrink-0 border-r border-[#e5e7eb] bg-white hover:bg-slate-50/80 cursor-pointer select-none transition-colors"
                >
                  {/* Icon reflects selection type */}
                  {totalSelectedGroups > 0 ? (
                    <LayoutGrid className="w-4 h-4 text-[#0091ff] stroke-[1.8]" />
                  ) : (
                    <svg
                      className="w-4 h-4 text-[#0091ff]"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <rect x="2" y="3" width="12" height="9" rx="1.5" />
                      <path d="M5 12v2h6v-2" />
                      <path d="M5 6h2v3H5z" fill="currentColor" stroke="none" />
                      <path d="M9 6h2v3H9z" fill="currentColor" stroke="none" />
                    </svg>
                  )}

                  {/* Mutually exclusive count label */}
                  <span>
                    {totalSelectedGroups > 0
                      ? `${totalSelectedGroups}个分析组已选择`
                      : `${totalSelectedLinks}条链路已选择`}
                  </span>

                  {isDropdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400 stroke-[2] ml-1" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2] ml-1" />
                  )}
                </button>

                {/* Right Input Area */}
                <div className="flex-1 flex items-center px-3.5 h-full gap-2">
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="IP支持离散IP、IP段及IP/子网掩码"
                    className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                  />
                  <Search className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.8] cursor-default" />
                </div>
              </div>

              {/* Dropdown Cascader Panel */}
              {isDropdownOpen && (
                <div className="absolute top-[39px] left-0 z-50 bg-white border border-[#e5e7eb] shadow-xl rounded-b-xs flex text-xs select-none">
                  {/* Column 1: 分类 (所有探针 & 分析组) */}
                  <div className="w-[140px] py-1 border-r border-[#e5e7eb] min-h-[220px] bg-white">
                    {/* 所有探针 */}
                    <div
                      onClick={() => setActiveMainCategory('probe')}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                        activeMainCategory === 'probe'
                          ? 'text-[#0091ff] font-medium bg-blue-50/40'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          onClick={handleToggleAllProbes}
                          title="全选/全不选所有探针链路"
                          className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center cursor-pointer transition-colors ${
                            isAllProbesSelected || isAllProbesIndeterminate
                              ? 'bg-[#0091ff] border border-[#0091ff]'
                              : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                          }`}
                        >
                          {isAllProbesSelected ? (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 6l3 3 5-6" />
                            </svg>
                          ) : isAllProbesIndeterminate ? (
                            <div className="w-2 h-0.5 bg-white rounded-full" />
                          ) : null}
                        </div>
                        <span>所有探针</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 stroke-[2] ${
                          activeMainCategory === 'probe' ? 'text-[#0091ff]' : 'text-slate-400'
                        }`}
                      />
                    </div>

                    {/* 分析组 */}
                    <div
                      onClick={() => setActiveMainCategory('group')}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                        activeMainCategory === 'group'
                          ? 'text-[#0091ff] font-medium bg-blue-50/40'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          onClick={handleToggleAllGroups}
                          title="全选/全不选分析组"
                          className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center cursor-pointer transition-colors ${
                            isAllGroupsSelected || isAllGroupsIndeterminate
                              ? 'bg-[#0091ff] border border-[#0091ff]'
                              : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                          }`}
                        >
                          {isAllGroupsSelected ? (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 6l3 3 5-6" />
                            </svg>
                          ) : isAllGroupsIndeterminate ? (
                            <div className="w-2 h-0.5 bg-white rounded-full" />
                          ) : null}
                        </div>
                        <span>分析组</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 stroke-[2] ${
                          activeMainCategory === 'group' ? 'text-[#0091ff]' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* BRANCH A: When activeMainCategory === 'probe' (探针分支) */}
                  {activeMainCategory === 'probe' && (
                    <>
                      {/* Column 2: 探针列表 (172.17.3.87, live55, live56) */}
                      <div className="w-[165px] py-1 border-r border-[#e5e7eb] min-h-[220px] bg-white">
                        {probes.map((probe) => {
                          const selectedCount = probe.interfaces.filter((i) => i.selected).length;
                          const isProbeAllSelected =
                            selectedCount === probe.interfaces.length && probe.interfaces.length > 0;
                          const isProbeIndeterminate =
                            selectedCount > 0 && selectedCount < probe.interfaces.length;
                          const isCurrent = probe.id === selectedProbeId;

                          return (
                            <div
                              key={probe.id}
                              onClick={() => setSelectedProbeId(probe.id)}
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'text-[#0091ff] font-medium'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={(e) => handleToggleProbe(probe.id, e)}
                                  className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center cursor-pointer transition-colors ${
                                    isProbeAllSelected || isProbeIndeterminate
                                      ? 'bg-[#0091ff] border border-[#0091ff]'
                                      : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                                  }`}
                                >
                                  {isProbeAllSelected ? (
                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M2 6l3 3 5-6" />
                                    </svg>
                                  ) : isProbeIndeterminate ? (
                                    <div className="w-2 h-0.5 bg-white rounded-full" />
                                  ) : null}
                                </div>
                                <span>{probe.name}</span>
                              </div>
                              <ChevronRight
                                className={`w-3.5 h-3.5 stroke-[2] ${
                                  isCurrent ? 'text-[#0091ff]' : 'text-slate-400'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 3: 接口列表 (接口1, 接口2) */}
                      <div className="w-[160px] py-1 min-h-[220px] bg-white">
                        {activeProbe.interfaces.map((intf) => (
                          <div
                            key={intf.id}
                            onClick={(e) => handleToggleInterface(activeProbe.id, intf.id, e)}
                            className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition-colors ${
                                  intf.selected
                                    ? 'bg-[#0091ff] border border-[#0091ff]'
                                    : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                                }`}
                              >
                                {intf.selected && (
                                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 6l3 3 5-6" />
                                  </svg>
                                )}
                              </div>
                              <span>{intf.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* BRANCH B: When activeMainCategory === 'group' (分析组分支 - 3个中控) */}
                  {activeMainCategory === 'group' && (
                    <>
                      {/* Column 2: 3个中控列表 */}
                      <div className="w-[165px] py-1 border-r border-[#e5e7eb] min-h-[220px] bg-white">
                        {controllers.map((ctrl) => {
                          const ctrlAllGroups = ctrl.categories.flatMap((c) => c.groups);
                          const selCount = ctrlAllGroups.filter((g) => g.selected).length;
                          const isCtrlAll = selCount === ctrlAllGroups.length && ctrlAllGroups.length > 0;
                          const isCtrlIndeterminate = selCount > 0 && selCount < ctrlAllGroups.length;
                          const isCurrent = ctrl.id === selectedControllerId;

                          return (
                            <div
                              key={ctrl.id}
                              onClick={() => setSelectedControllerId(ctrl.id)}
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'text-[#0091ff] font-medium bg-blue-50/30'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <div
                                  onClick={(e) => handleToggleController(ctrl.id, e)}
                                  className={`w-3.5 h-3.5 shrink-0 rounded-xs flex items-center justify-center cursor-pointer transition-colors ${
                                    isCtrlAll || isCtrlIndeterminate
                                      ? 'bg-[#0091ff] border border-[#0091ff]'
                                      : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                                  }`}
                                >
                                  {isCtrlAll ? (
                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M2 6l3 3 5-6" />
                                    </svg>
                                  ) : isCtrlIndeterminate ? (
                                    <div className="w-2 h-0.5 bg-white rounded-full" />
                                  ) : null}
                                </div>
                                <span className="truncate" title={ctrl.name}>{ctrl.name}</span>
                              </div>
                              <ChevronRight
                                className={`w-3.5 h-3.5 shrink-0 stroke-[2] ${
                                  isCurrent ? 'text-[#0091ff]' : 'text-slate-400'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 3: 接口分析组 & VLAN分析组 */}
                      <div className="w-[145px] py-1 border-r border-[#e5e7eb] min-h-[220px] bg-white">
                        {activeController.categories.map((cat) => {
                          const selCount = cat.groups.filter((g) => g.selected).length;
                          const isCatAll = selCount === cat.groups.length && cat.groups.length > 0;
                          const isCatIndeterminate = selCount > 0 && selCount < cat.groups.length;
                          const isCurrent = cat.id === selectedGroupCategoryId;

                          return (
                            <div
                              key={cat.id}
                              onClick={() => setSelectedGroupCategoryId(cat.id)}
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'text-[#0091ff] font-medium bg-blue-50/30'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={(e) => handleToggleGroupCategory(cat.id, e)}
                                  className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center cursor-pointer transition-colors ${
                                    isCatAll || isCatIndeterminate
                                      ? 'bg-[#0091ff] border border-[#0091ff]'
                                      : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                                  }`}
                                >
                                  {isCatAll ? (
                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M2 6l3 3 5-6" />
                                    </svg>
                                  ) : isCatIndeterminate ? (
                                    <div className="w-2 h-0.5 bg-white rounded-full" />
                                  ) : null}
                                </div>
                                <span>{cat.name}</span>
                              </div>
                              <ChevronRight
                                className={`w-3.5 h-3.5 stroke-[2] ${
                                  isCurrent ? 'text-[#0091ff]' : 'text-slate-400'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Column 4: 具体分析组名称列表 */}
                      <div className="w-[285px] py-1 min-h-[220px] max-h-[260px] overflow-y-auto bg-white">
                        {activeCategory.groups.map((group) => (
                          <div
                            key={group.id}
                            onClick={(e) => handleToggleGroupItem(group.id, e)}
                            className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div
                                className={`w-3.5 h-3.5 shrink-0 rounded-xs flex items-center justify-center transition-colors ${
                                  group.selected
                                    ? 'bg-[#0091ff] border border-[#0091ff]'
                                    : 'border border-slate-300 bg-white hover:border-[#0091ff]'
                                }`}
                              >
                                {group.selected && (
                                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 6l3 3 5-6" />
                                  </svg>
                                )}
                              </div>

                              {/* Blue Topology / Network Link Icon */}
                              <svg
                                className="w-3.5 h-3.5 text-[#0091ff] shrink-0"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <circle cx="3" cy="12" r="2" fill="currentColor" />
                                <circle cx="3" cy="4" r="2" fill="currentColor" />
                                <circle cx="12" cy="8" r="2" fill="currentColor" />
                                <path d="M3 6v4M5 4.5l5 2.5M5 11.5l5-2.5" stroke="currentColor" strokeWidth="1.4" />
                              </svg>

                              <span className="truncate text-slate-700 text-xs" title={group.name}>
                                {group.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* SEARCH RESULTS SECTION (FIGURE 1 & FIGURE 2 INTEGRATED)   */}
            {/* ========================================================= */}
            <div className="mt-5 border border-[#e5e7eb] rounded-xs overflow-hidden shadow-xs bg-white">
              {/* History Search Record Tag Bar (Figure 2 Style) */}
              <div className="px-4 py-2 bg-[#f8fafc] border-b border-[#e5e7eb] flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-normal">历史记录：</span>
                  {historySearchTag && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white border border-[#d1d5db] rounded text-slate-700 text-xs">
                      <span>{historySearchTag}</span>
                      <button
                        type="button"
                        onClick={() => setHistorySearchTag(null)}
                        className="hover:text-red-500 text-slate-400 cursor-pointer"
                        title="删除该条历史"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setHistorySearchTag(null)}
                  className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                  title="清空历史记录"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Multi-Controller Result Tabs Bar (Light-colored Tab Style) */}
              <div className="bg-[#f5f7fa] px-3 pt-2 flex items-center justify-between border-b border-[#e5e7eb]">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {controllersWithSelectedGroups.length > 0 ? (
                    controllersWithSelectedGroups.map((ctrl) => {
                      const count = ctrl.categories.reduce(
                        (acc, cat) => acc + cat.groups.filter((g) => g.selected).length,
                        0
                      );
                      const isActive = ctrl.id === activeResultCtrlId;

                      return (
                        <div
                          key={ctrl.id}
                          onClick={() => setActiveResultCtrlId(ctrl.id)}
                          className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-t cursor-pointer transition-all ${
                            isActive
                              ? 'bg-white text-slate-800 font-medium border-t-2 border-t-[#0091ff] border-x border-[#e5e7eb] -mb-[1px] shadow-2xs'
                              : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                          }`}
                        >
                          {/* Controller link icon */}
                          <svg
                            className={`w-3.5 h-3.5 ${isActive ? 'text-[#0091ff]' : 'text-slate-400'}`}
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <rect x="2" y="3" width="12" height="9" rx="1.5" />
                            <path d="M5 12v2h6v-2" />
                            <path d="M5 6h2v3H5z" fill="currentColor" stroke="none" />
                            <path d="M9 6h2v3H9z" fill="currentColor" stroke="none" />
                          </svg>

                          <span>{ctrl.name}</span>

                          {/* Result Count Badge */}
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[11px] tabular-nums font-medium ${
                              isActive ? 'bg-[#0091ff] text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {count}
                          </span>

                          {/* Close Tab Icon */}
                          <button
                            type="button"
                            onClick={(e) => handleCloseResultTab(ctrl.id, e)}
                            className="ml-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="关闭此中控结果"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    /* Default active tab when no controller is explicitly selected */
                    <div className="flex items-center gap-2 px-3.5 py-2 text-xs rounded-t bg-white text-slate-800 font-medium border-t-2 border-t-[#0091ff] border-x border-[#e5e7eb] -mb-[1px] shadow-2xs">
                      <svg
                        className="w-3.5 h-3.5 text-[#0091ff]"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <rect x="2" y="3" width="12" height="9" rx="1.5" />
                        <path d="M5 12v2h6v-2" />
                      </svg>
                      <span>{controllers[0].name}</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-[#0091ff] text-white">
                        {controllers[0].categories[0].groups.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Body (Tall Enterprise Table with Comfortably Padded Rows) */}
              <div className="overflow-x-auto bg-white min-h-[500px]">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#fcfdfe] text-slate-600 border-b border-[#e5e7eb] font-medium select-none">
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            currentResultGroups.length > 0 &&
                            selectedRowIds.length === currentResultGroups.length
                          }
                          onChange={handleSelectAllRows}
                          className="rounded-xs text-[#0091ff] focus:ring-0 cursor-pointer w-3.5 h-3.5 border-slate-300"
                        />
                      </th>

                      {/* 对象信息 (Modified to display Analysis Group Name as requested!) */}
                      <th className="py-3 px-3 min-w-[240px] text-slate-700">
                        <div className="flex items-center gap-1">
                          <span>对象信息 (分析组名称)</span>
                        </div>
                      </th>

                      {/* 主机IP */}
                      <th
                        onClick={() => handleSort('ip')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>主机IP</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 链路 */}
                      <th
                        onClick={() => handleSort('link')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>链路</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 总流量 */}
                      <th
                        onClick={() => handleSort('totalFlow')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>总流量</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 速率 */}
                      <th
                        onClick={() => handleSort('speed')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>速率</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 数据包数 */}
                      <th
                        onClick={() => handleSort('packetCount')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>数据包数</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 平均包率 */}
                      <th
                        onClick={() => handleSort('avgPacketRate')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>平均包率</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 网络时延 */}
                      <th
                        onClick={() => handleSort('networkLatency')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>网络时延</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 响应时间-服务器 */}
                      <th
                        onClick={() => handleSort('serverRespTime')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>响应时间-服务器</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 会话状态 */}
                      <th
                        onClick={() => handleSort('status')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>会话状态</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 会话开始时间 */}
                      <th
                        onClick={() => handleSort('startTime')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>会话开始时间</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 最后更新时间 */}
                      <th
                        onClick={() => handleSort('lastUpdated')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>最后更新时间</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 站点 */}
                      <th
                        onClick={() => handleSort('site')}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>站点</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>

                      {/* 操作 */}
                      <th className="py-2.5 px-4 text-center">
                        <span>操作</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0f2f5] text-slate-700">
                    {currentResultGroups.length > 0 ? (
                      currentResultGroups.map((group) => {
                        const isChecked = selectedRowIds.includes(group.id);

                        return (
                          <tr
                            key={group.id}
                            className={`hover:bg-blue-50/20 transition-colors ${
                              isChecked ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleRow(group.id)}
                                className="rounded-xs text-[#0091ff] focus:ring-0 cursor-pointer w-3.5 h-3.5 border-slate-300"
                              />
                            </td>

                            {/* 对象信息 (Analysis Group Name with blue link pin icon) */}
                            <td className="py-4 px-3 font-normal text-slate-800">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-3.5 h-3.5 text-[#0091ff] shrink-0"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                >
                                  <circle cx="3" cy="12" r="2" fill="currentColor" />
                                  <circle cx="3" cy="4" r="2" fill="currentColor" />
                                  <circle cx="12" cy="8" r="2" fill="currentColor" />
                                  <path d="M3 6v4M5 4.5l5 2.5M5 11.5l5-2.5" stroke="currentColor" strokeWidth="1.4" />
                                </svg>
                                <span className="font-medium text-slate-800 hover:text-[#0091ff] cursor-pointer">
                                  {group.name}
                                </span>
                              </div>
                            </td>

                            {/* 主机IP */}
                            <td className="py-4 px-3 font-semibold text-slate-900 tabular-nums">
                              {group.ip}
                            </td>

                            {/* 链路 */}
                            <td className="py-4 px-3 text-slate-600 truncate max-w-[150px]" title={group.link}>
                              {group.link}
                            </td>

                            {/* 总流量 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {group.totalFlow}
                            </td>

                            {/* 速率 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {group.speed}
                            </td>

                            {/* 数据包数 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {group.packetCount.toLocaleString()}
                            </td>

                            {/* 平均包率 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {group.avgPacketRate}
                            </td>

                            {/* 网络时延 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {group.networkLatency}
                            </td>

                            {/* 响应时间-服务器 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {group.serverRespTime}
                            </td>

                            {/* 会话状态 (Green 活跃 badge matching Figure 1) */}
                            <td className="py-4 px-3">
                              <span className="inline-flex items-center justify-center bg-[#00b42a] text-white text-[11px] font-medium px-3 py-0.5 rounded-xs shadow-2xs">
                                {group.status}
                              </span>
                            </td>

                            {/* 会话开始时间 */}
                            <td className="py-4 px-3 font-mono text-slate-600 text-[11px] tabular-nums">
                              {group.startTime}
                            </td>

                            {/* 最后更新时间 */}
                            <td className="py-4 px-3 font-mono text-slate-600 text-[11px] tabular-nums">
                              {group.lastUpdated}
                            </td>

                            {/* 站点 */}
                            <td className="py-4 px-3 text-slate-600">
                              {group.site}
                            </td>

                            {/* 操作 (Download Packet, Jump Arrow) */}
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-3 text-slate-500">
                                <button
                                  type="button"
                                  className="hover:text-[#0091ff] p-0.5 transition-colors cursor-pointer"
                                  title="下载数据包 (PCAP)"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="hover:text-[#0091ff] p-0.5 transition-colors cursor-pointer"
                                  title="跳转关联拓扑"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={15} className="py-8 text-center text-slate-400">
                          暂无匹配的分析组数据，请在下拉框中选择分析组或输入关键字进行搜索
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Summary Footer */}
              <div className="px-4 py-2 bg-[#fcfdfe] border-t border-[#e5e7eb] flex items-center justify-between text-xs text-slate-500">
                <span>
                  当前中控展示 {currentResultGroups.length} 条记录 (已勾选 {selectedRowIds.length} 项)
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <span>每页 10 条</span>
                  <span>1 / 1 页</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Floating Badge (Language / Translation toggle) */}
          <div className="fixed bottom-6 right-6 z-30">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#fde8e8] border border-[#fca5a5] text-[#e02424] flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity cursor-default"
              title="切换语言"
            >
              <span className="text-[11px] font-bold tracking-tighter">中/A</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
