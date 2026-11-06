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
  Settings,
  HelpCircle,
  ArrowLeft,
  Clock,
  Trash2,
  X,
  ArrowUpDown,
  Download,
  ExternalLink,
  Folder,
  Server,
  Network,
} from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'controller' | 'category' | 'group' | 'probe' | 'interface';
  selected?: boolean;
  expanded?: boolean;
  children?: TreeNode[];
  // Metadata for search results table
  ip?: string;
  link?: string;
  totalFlow?: string;
  speed?: string;
  packetCount?: number;
  avgPacketRate?: string;
  networkLatency?: string;
  serverRespTime?: string;
  status?: string;
  startTime?: string;
  lastUpdated?: string;
  site?: string;
  controllerName?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'host' | 'ip' | 'tcp' | 'udp'>('host');
  const [searchVal, setSearchVal] = useState('172.17.3.2');
  const [historySearchTag, setHistorySearchTag] = useState<string | null>('172.17.3.2');

  // Dropdown open/close state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Top Tabs inside the Dropdown: 'analysisGroup' (分析组, 前) or 'controller' (中控, 后)
  const [dropdownTab, setDropdownTab] = useState<'analysisGroup' | 'controller'>('analysisGroup');

  // =========================================================================
  // Tab 1: 分析组 - 纵向树形结构 (按照原有逻辑层级：中控 -> 接口/VLAN分析组 -> 具名分析组)
  // =========================================================================
  const [analysisTree, setAnalysisTree] = useState<TreeNode[]>([
    {
      id: 'tree-ctrl-1',
      name: '中控1 (德胜DC)',
      type: 'controller',
      expanded: true,
      children: [
        {
          id: 'c1-cat-interface',
          name: '接口分析组',
          type: 'category',
          expanded: true,
          children: [
            {
              id: 'c1-int-1',
              name: '德胜DC-P1到上海总部DC-P1',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
            {
              id: 'c1-int-2',
              name: '德胜DC-P1到西安主中心DC-P1',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
            {
              id: 'c1-int-3',
              name: '稻香湖DC-P2到张江DC-P1',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
            {
              id: 'c1-int-4',
              name: '稻香湖DC-P2到西安转接中心DC-P1',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
            {
              id: 'c1-int-5',
              name: '张江DC-P1到西安转接中心DC-P1',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
            {
              id: 'c1-int-6',
              name: '上海总部DC-P2到西安主中心DC-P1',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
          ],
        },
        {
          id: 'c1-cat-vlan',
          name: 'VLAN分析组',
          type: 'category',
          expanded: false,
          children: [
            {
              id: 'c1-vlan-1',
              name: '德胜DC-VLAN100_核心生产链路',
              type: 'group',
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
              controllerName: '中控1 (德胜DC)',
            },
            {
              id: 'c1-vlan-2',
              name: '德胜DC-VLAN200_跨中心互联',
              type: 'group',
              selected: false,
              ip: '172.17.3.2',
              link: 'VLAN200_Inter',
              totalFlow: '11.20 MB',
              speed: '280.10 Kbps',
              packetCount: 25400,
              avgPacketRate: '84.66 pps',
              networkLatency: '3.20 ms',
              serverRespTime: '11.50 ms',
              status: '活跃',
              startTime: '2026-11-04 09:32:00.000000',
              lastUpdated: '2026-11-04 17:05:58.000000',
              site: 'Server172.17',
              controllerName: '中控1 (德胜DC)',
            },
          ],
        },
      ],
    },
    {
      id: 'tree-ctrl-2',
      name: '中控2 (稻香湖DC)',
      type: 'controller',
      expanded: false,
      children: [
        {
          id: 'c2-cat-interface',
          name: '接口分析组',
          type: 'category',
          expanded: true,
          children: [
            {
              id: 'c2-int-1',
              name: '稻香湖DC-P1到德胜DC-P1',
              type: 'group',
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
              controllerName: '中控2 (稻香湖DC)',
            },
            {
              id: 'c2-int-2',
              name: '稻香湖DC-P1到上海总部DC-P2',
              type: 'group',
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
              controllerName: '中控2 (稻香湖DC)',
            },
            {
              id: 'c2-int-3',
              name: '稻香湖DC-P2到西安主中心DC-P2',
              type: 'group',
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
              controllerName: '中控2 (稻香湖DC)',
            },
          ],
        },
        {
          id: 'c2-cat-vlan',
          name: 'VLAN分析组',
          type: 'category',
          expanded: false,
          children: [
            {
              id: 'c2-vlan-1',
              name: '稻香湖DC-VLAN10_数据交换专网',
              type: 'group',
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
              controllerName: '中控2 (稻香湖DC)',
            },
          ],
        },
      ],
    },
    {
      id: 'tree-ctrl-3',
      name: '中控3 (张江DC)',
      type: 'controller',
      expanded: false,
      children: [
        {
          id: 'c3-cat-interface',
          name: '接口分析组',
          type: 'category',
          expanded: true,
          children: [
            {
              id: 'c3-int-1',
              name: '张江DC-P1到上海总部DC-P1',
              type: 'group',
              selected: false,
              ip: '172.17.3.2',
              link: 'Financial Bus(V2001)',
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
              controllerName: '中控3 (张江DC)',
            },
            {
              id: 'c3-int-2',
              name: '张江DC-P1到德胜DC-P2',
              type: 'group',
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
              controllerName: '中控3 (张江DC)',
            },
          ],
        },
        {
          id: 'c3-cat-vlan',
          name: 'VLAN分析组',
          type: 'category',
          expanded: false,
          children: [
            {
              id: 'c3-vlan-1',
              name: '张江DC-VLAN101_金融交易通道',
              type: 'group',
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
              controllerName: '中控3 (张江DC)',
            },
          ],
        },
      ],
    },
  ]);

  // =========================================================================
  // Tab 2: 中控 - 纵向树形结构 (环境分类：产品 / 交行VIP / 升级环境 -> 探针 -> 接口)
  // =========================================================================
  const [controllerTree, setControllerTree] = useState<TreeNode[]>([
    {
      id: 'tree-env-product',
      name: '产品',
      type: 'controller',
      expanded: true,
      children: [
        {
          id: 'probe-632',
          name: '探针6.32（无智溯）',
          type: 'probe',
          expanded: false,
          children: [
            {
              id: 'p632-int1',
              name: '接口1',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: '探针6.32(接口1)',
              totalFlow: '12.40 MB',
              speed: '330.15 Kbps',
              packetCount: 29400,
              avgPacketRate: '98.00 pps',
              networkLatency: '3.80 ms',
              serverRespTime: '44.20 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:30.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
              controllerName: '产品',
            },
            {
              id: 'p632-int2',
              name: '接口2',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: '探针6.32(接口2)',
              totalFlow: '8.10 MB',
              speed: '210.40 Kbps',
              packetCount: 19100,
              avgPacketRate: '63.66 pps',
              networkLatency: '4.10 ms',
              serverRespTime: '38.00 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:35.000000',
              lastUpdated: '2026-11-04 17:05:58.000000',
              site: 'Server172.17',
              controllerName: '产品',
            },
          ],
        },
        {
          id: 'probe-147',
          name: '探针147',
          type: 'probe',
          expanded: true,
          children: [
            {
              id: 'p147-int1',
              name: '接口1',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: '探针147(接口1)',
              totalFlow: '15.60 MB',
              speed: '410.20 Kbps',
              packetCount: 36200,
              avgPacketRate: '120.66 pps',
              networkLatency: '2.90 ms',
              serverRespTime: '31.40 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:20.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
              controllerName: '产品',
            },
            {
              id: 'p147-int2',
              name: '接口2',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: '探针147(接口2)',
              totalFlow: '11.80 MB',
              speed: '295.40 Kbps',
              packetCount: 27500,
              avgPacketRate: '91.66 pps',
              networkLatency: '3.40 ms',
              serverRespTime: '36.80 ms',
              status: '活跃',
              startTime: '2026-11-04 09:35:25.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
              controllerName: '产品',
            },
          ],
        },
      ],
    },
    {
      id: 'tree-env-vip',
      name: '交行VIP',
      type: 'controller',
      expanded: false,
      children: [
        {
          id: 'probe-vip1',
          name: '探针VIP-01',
          type: 'probe',
          expanded: false,
          children: [
            {
              id: 'pvip1-int1',
              name: '接口1',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: 'VIP-01(接口1)',
              totalFlow: '21.50 MB',
              speed: '580.10 Kbps',
              packetCount: 51000,
              avgPacketRate: '170.00 pps',
              networkLatency: '1.60 ms',
              serverRespTime: '15.20 ms',
              status: '活跃',
              startTime: '2026-11-04 09:30:10.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
              controllerName: '交行VIP',
            },
            {
              id: 'pvip1-int2',
              name: '接口2',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: 'VIP-01(接口2)',
              totalFlow: '16.30 MB',
              speed: '430.50 Kbps',
              packetCount: 38500,
              avgPacketRate: '128.33 pps',
              networkLatency: '2.10 ms',
              serverRespTime: '21.60 ms',
              status: '活跃',
              startTime: '2026-11-04 09:30:15.000000',
              lastUpdated: '2026-11-04 17:05:59.000000',
              site: 'Server172.17',
              controllerName: '交行VIP',
            },
          ],
        },
        {
          id: 'probe-vip2',
          name: '探针VIP-02',
          type: 'probe',
          expanded: false,
          children: [
            {
              id: 'pvip2-int1',
              name: '接口1',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: 'VIP-02(接口1)',
              totalFlow: '14.80 MB',
              speed: '390.20 Kbps',
              packetCount: 35000,
              avgPacketRate: '116.66 pps',
              networkLatency: '2.40 ms',
              serverRespTime: '24.10 ms',
              status: '活跃',
              startTime: '2026-11-04 09:32:00.000000',
              lastUpdated: '2026-11-04 17:05:58.000000',
              site: 'Server172.17',
              controllerName: '交行VIP',
            },
          ],
        },
      ],
    },
    {
      id: 'tree-env-upgrade',
      name: '升级环境',
      type: 'controller',
      expanded: false,
      children: [
        {
          id: 'probe-up1',
          name: '升级探针Alpha',
          type: 'probe',
          expanded: false,
          children: [
            {
              id: 'pup1-int1',
              name: '接口1',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: 'Alpha(接口1)',
              totalFlow: '6.40 MB',
              speed: '160.20 Kbps',
              packetCount: 15200,
              avgPacketRate: '50.66 pps',
              networkLatency: '5.20 ms',
              serverRespTime: '48.50 ms',
              status: '活跃',
              startTime: '2026-11-04 09:38:00.000000',
              lastUpdated: '2026-11-04 17:05:55.000000',
              site: 'Server172.17',
              controllerName: '升级环境',
            },
            {
              id: 'pup1-int2',
              name: '接口2',
              type: 'interface',
              selected: false,
              ip: '172.17.3.2',
              link: 'Alpha(接口2)',
              totalFlow: '4.80 MB',
              speed: '120.40 Kbps',
              packetCount: 11400,
              avgPacketRate: '38.00 pps',
              networkLatency: '5.60 ms',
              serverRespTime: '52.10 ms',
              status: '活跃',
              startTime: '2026-11-04 09:38:10.000000',
              lastUpdated: '2026-11-04 17:05:55.000000',
              site: 'Server172.17',
              controllerName: '升级环境',
            },
          ],
        },
      ],
    },
  ]);

  // Multi-controller Result Tab State in the Results Table
  const [activeResultCtrlId, setActiveResultCtrlId] = useState<string>('中控1 (德胜DC)');

  // Table row multi-selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Sorting
  const [sortField, setSortField] = useState<keyof TreeNode>('totalFlow');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Helper: Get all leaf nodes
  const getAllLeaves = (nodes: TreeNode[]): TreeNode[] => {
    let result: TreeNode[] = [];
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        result = result.concat(getAllLeaves(node.children));
      } else {
        result.push(node);
      }
    });
    return result;
  };

  const selectedAnalysisLeaves = useMemo(
    () => getAllLeaves(analysisTree).filter((n) => n.selected),
    [analysisTree]
  );

  const selectedCtrlLeaves = useMemo(
    () => getAllLeaves(controllerTree).filter((n) => n.selected),
    [controllerTree]
  );

  // Mutual exclusion: Clear functions
  const clearAnalysisTree = () => {
    const deselectNode = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) => ({
        ...node,
        selected: false,
        children: node.children ? deselectNode(node.children) : undefined,
      }));
    setAnalysisTree((prev) => deselectNode(prev));
  };

  const clearControllerTree = () => {
    const deselectNode = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) => ({
        ...node,
        selected: false,
        children: node.children ? deselectNode(node.children) : undefined,
      }));
    setControllerTree((prev) => deselectNode(prev));
  };

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

  // Check state calculation for tree node (checked, indeterminate, unchecked)
  const getNodeCheckState = (node: TreeNode): { isChecked: boolean; isIndeterminate: boolean } => {
    const leaves = getAllLeaves([node]);
    if (leaves.length === 0) return { isChecked: false, isIndeterminate: false };
    const selCount = leaves.filter((l) => l.selected).length;
    const isChecked = selCount === leaves.length;
    const isIndeterminate = selCount > 0 && selCount < leaves.length;
    return { isChecked, isIndeterminate };
  };

  // Generic Expand/Collapse
  const handleToggleExpand = (
    tree: 'analysis' | 'controller',
    nodeId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const updateExpand = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) => {
        if (n.id === nodeId) {
          return { ...n, expanded: !n.expanded };
        }
        if (n.children) {
          return { ...n, children: updateExpand(n.children) };
        }
        return n;
      });

    if (tree === 'analysis') {
      setAnalysisTree((prev) => updateExpand(prev));
    } else {
      setControllerTree((prev) => updateExpand(prev));
    }
  };

  // Generic Checkbox Toggle (with Hierarchical Cascade + Mutual Exclusion)
  const handleToggleCheckbox = (
    tree: 'analysis' | 'controller',
    node: TreeNode,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    // Mutual exclusion between tabs
    if (tree === 'analysis') {
      clearControllerTree();
    } else {
      clearAnalysisTree();
    }

    const leaves = getAllLeaves([node]);
    const allSelected = leaves.every((l) => l.selected);
    const targetState = !allSelected;

    const setLeafState = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) => {
        if (n.id === node.id) {
          const makeState = (subNodes: TreeNode[]): TreeNode[] =>
            subNodes.map((sn) => ({
              ...sn,
              selected: targetState,
              children: sn.children ? makeState(sn.children) : undefined,
            }));
          return {
            ...n,
            selected: targetState,
            children: n.children ? makeState(n.children) : undefined,
          };
        }
        if (n.children) {
          return { ...n, children: setLeafState(n.children) };
        }
        return n;
      });

    if (tree === 'analysis') {
      setAnalysisTree((prev) => setLeafState(prev));
    } else {
      setControllerTree((prev) => setLeafState(prev));
    }
  };

  // Controllers grouping for the search results tabs
  const resultControllers = useMemo(() => {
    // If analysis groups are selected: group by controllerName
    if (selectedAnalysisLeaves.length > 0) {
      const map = new Map<string, TreeNode[]>();
      selectedAnalysisLeaves.forEach((leaf) => {
        const cName = leaf.controllerName || '中控1 (德胜DC)';
        if (!map.has(cName)) map.set(cName, []);
        map.get(cName)!.push(leaf);
      });
      return Array.from(map.entries()).map(([name, list]) => ({
        id: name,
        name,
        count: list.length,
        items: list,
      }));
    }

    // If controller links are selected: group by controller/environment name
    if (selectedCtrlLeaves.length > 0) {
      const map = new Map<string, TreeNode[]>();
      selectedCtrlLeaves.forEach((leaf) => {
        const cName = leaf.controllerName || '产品';
        if (!map.has(cName)) map.set(cName, []);
        map.get(cName)!.push(leaf);
      });
      return Array.from(map.entries()).map(([name, list]) => ({
        id: name,
        name: `${name}中控`,
        count: list.length,
        items: list,
      }));
    }

    // Default fallback
    return [
      {
        id: '中控1 (德胜DC)',
        name: '中控1 (德胜DC)',
        count: 4,
        items: getAllLeaves(analysisTree).slice(0, 4),
      },
    ];
  }, [selectedAnalysisLeaves, selectedCtrlLeaves, analysisTree]);

  // Keep activeResultCtrlId valid
  useEffect(() => {
    if (resultControllers.length > 0) {
      const exists = resultControllers.some((c) => c.id === activeResultCtrlId);
      if (!exists) {
        setActiveResultCtrlId(resultControllers[0].id);
      }
    }
  }, [resultControllers, activeResultCtrlId]);

  const currentResultCtrl =
    resultControllers.find((c) => c.id === activeResultCtrlId) || resultControllers[0];

  // Filtered and sorted table data
  const currentTableRows = useMemo(() => {
    const list = currentResultCtrl?.items || [];
    const filtered = searchVal.trim()
      ? list.filter((g) => (g.ip && g.ip.includes(searchVal.trim())) || g.name.includes(searchVal.trim()))
      : list;

    return [...filtered].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA || '').localeCompare(String(valB || ''))
        : String(valB || '').localeCompare(String(valA || ''));
    });
  }, [currentResultCtrl, searchVal, sortField, sortAsc]);

  // Table row selection toggles
  const handleSelectAllRows = () => {
    if (selectedRowIds.length === currentTableRows.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(currentTableRows.map((g) => g.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Sort toggle
  const handleSort = (field: keyof TreeNode) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Close tab in result view (unselects all groups in that controller)
  const handleCloseResultTab = (ctrlId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Deselect leaves matching this controller
    const deselectCtrl = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) => {
        const matches = n.controllerName === ctrlId || n.name === ctrlId;
        return {
          ...n,
          selected: matches ? false : n.selected,
          children: n.children ? deselectCtrl(n.children) : undefined,
        };
      });

    setAnalysisTree((prev) => deselectCtrl(prev));
    setControllerTree((prev) => deselectCtrl(prev));
  };

  // =========================================================================
  // 纵向树形节点渲染器 (Vertical Tree View Renderer for both Analysis & Controller)
  // =========================================================================
  const renderVerticalTreeNode = (
    tree: 'analysis' | 'controller',
    node: TreeNode,
    depth: number = 0
  ) => {
    const hasChildren = node.children && node.children.length > 0;
    const { isChecked, isIndeterminate } = getNodeCheckState(node);

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center justify-between py-1.5 px-3 hover:bg-slate-50 cursor-pointer text-xs transition-colors"
          style={{ paddingLeft: `${12 + depth * 18}px` }}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            {/* Expand / Collapse square button [+] / [-] */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => handleToggleExpand(tree, node.id, e)}
                className="w-3.5 h-3.5 border border-[#0091ff] rounded-xs flex items-center justify-center text-[#0091ff] text-[10px] font-bold bg-white hover:bg-blue-50 cursor-pointer shrink-0"
              >
                {node.expanded ? '-' : '+'}
              </button>
            ) : (
              <div className="w-3.5 h-3.5 shrink-0" />
            )}

            {/* Type Icons */}
            {node.type === 'controller' && (
              <Server className="w-3.5 h-3.5 text-[#0091ff] shrink-0" />
            )}
            {node.type === 'category' && (
              <Folder className="w-3.5 h-3.5 text-slate-400 fill-slate-200 shrink-0" />
            )}
            {node.type === 'group' && (
              /* Blue Topology Branching Nodes Icon for Analysis Groups */
              <svg className="w-3.5 h-3.5 text-[#0091ff] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="3" cy="12" r="1.8" fill="currentColor" />
                <circle cx="3" cy="4" r="1.8" fill="currentColor" />
                <circle cx="12" cy="8" r="1.8" fill="currentColor" />
                <path d="M3 6v4M5 4.5l5 2.5M5 11.5l5-2.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            )}
            {node.type === 'probe' && (
              <Monitor className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[1.8]" />
            )}
            {node.type === 'interface' && (
              <Network className="w-3.5 h-3.5 text-[#0091ff] shrink-0 stroke-[1.8]" />
            )}

            {/* Node Name */}
            <span
              onClick={(e) =>
                hasChildren
                  ? handleToggleExpand(tree, node.id, e)
                  : handleToggleCheckbox(tree, node, e)
              }
              className={`truncate hover:text-[#0091ff] cursor-pointer ${
                hasChildren ? 'text-slate-700 font-medium' : 'text-slate-600'
              }`}
              title={node.name}
            >
              {node.name}
            </span>
          </div>

          {/* Checkbox on the FAR RIGHT */}
          <div
            onClick={(e) => handleToggleCheckbox(tree, node, e)}
            className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center cursor-pointer transition-colors shrink-0 ml-4 ${
              isChecked || isIndeterminate
                ? 'bg-[#0091ff] border border-[#0091ff]'
                : 'border border-slate-300 bg-white hover:border-[#0091ff]'
            }`}
          >
            {isChecked ? (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6l3 3 5-6" />
              </svg>
            ) : isIndeterminate ? (
              <div className="w-2 h-0.5 bg-white rounded-full" />
            ) : null}
          </div>
        </div>

        {/* Render Children if expanded (纵向展开) */}
        {hasChildren && node.expanded && (
          <div>
            {node.children!.map((child) => renderVerticalTreeNode(tree, child, depth + 1))}
          </div>
        )}
      </div>
    );
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

            {/* Middle Row: Object Category Tabs */}
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
                {/* Left Selector: Trigger for Dropdown Modal */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3.5 h-full text-xs text-slate-800 shrink-0 border-r border-[#e5e7eb] bg-white hover:bg-slate-50/80 cursor-pointer select-none transition-colors"
                >
                  {/* Icon reflects selection type */}
                  {selectedAnalysisLeaves.length > 0 ? (
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

                  {/* Mutually exclusive count label matching 5个分析组已选择 */}
                  <span>
                    {selectedAnalysisLeaves.length > 0
                      ? `${selectedAnalysisLeaves.length}个分析组已选择`
                      : selectedCtrlLeaves.length > 0
                      ? `${selectedCtrlLeaves.length}条链路已选择`
                      : '选择分析对象'}
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

              {/* ============================================================== */}
              {/* DROPDOWN PANEL: 纵向树形结构 (分析组在前，中控在后)              */}
              {/* ============================================================== */}
              {isDropdownOpen && (
                <div className="absolute top-[39px] left-0 z-50 bg-white border border-[#e5e7eb] shadow-xl rounded-b-xs text-xs select-none w-[420px]">
                  {/* Top Tabs inside Dropdown: 分析组 (前) | 中控 (后) */}
                  <div className="flex items-center gap-6 px-4 pt-2 border-b border-[#e5e7eb] bg-white">
                    {/* Tab 1: 分析组 (前) */}
                    <button
                      type="button"
                      onClick={() => setDropdownTab('analysisGroup')}
                      className={`flex items-center gap-1.5 pb-2 -mb-[1px] cursor-pointer transition-all ${
                        dropdownTab === 'analysisGroup'
                          ? 'text-[#0091ff] font-medium border-b-2 border-[#0091ff]'
                          : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                      }`}
                    >
                      <span>分析组</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                          dropdownTab === 'analysisGroup'
                            ? 'bg-[#e6f4ff] text-[#0091ff]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {selectedAnalysisLeaves.length > 0
                          ? `${selectedAnalysisLeaves.length}条`
                          : '16条'}
                      </span>
                    </button>

                    {/* Tab 2: 中控 (后) */}
                    <button
                      type="button"
                      onClick={() => setDropdownTab('controller')}
                      className={`flex items-center gap-1.5 pb-2 -mb-[1px] cursor-pointer transition-all ${
                        dropdownTab === 'controller'
                          ? 'text-[#0091ff] font-medium border-b-2 border-[#0091ff]'
                          : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                      }`}
                    >
                      <span>中控</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                          dropdownTab === 'controller'
                            ? 'bg-[#e6f4ff] text-[#0091ff]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {selectedCtrlLeaves.length > 0 ? `${selectedCtrlLeaves.length}条` : '8条'}
                      </span>
                    </button>
                  </div>

                  {/* TAB 1 CONTENT: 分析组纵向树形展示 (中控 -> 接口/VLAN分析组 -> 具体分析组) */}
                  {dropdownTab === 'analysisGroup' && (
                    <div className="py-2 max-h-[350px] overflow-y-auto">
                      {analysisTree.map((node) => renderVerticalTreeNode('analysis', node, 0))}
                    </div>
                  )}

                  {/* TAB 2 CONTENT: 中控纵向树形展示 (环境 -> 探针 -> 接口) */}
                  {dropdownTab === 'controller' && (
                    <div className="py-2 max-h-[350px] overflow-y-auto">
                      {controllerTree.map((node) => renderVerticalTreeNode('controller', node, 0))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* SEARCH RESULTS SECTION                                    */}
            {/* ========================================================= */}
            <div className="mt-5 border border-[#e5e7eb] rounded-xs overflow-hidden shadow-xs bg-white">
              {/* History Search Record Tag Bar */}
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
                  {resultControllers.map((ctrl) => {
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
                          {ctrl.count}
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
                  })}
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
                            currentTableRows.length > 0 &&
                            selectedRowIds.length === currentTableRows.length
                          }
                          onChange={handleSelectAllRows}
                          className="rounded-xs text-[#0091ff] focus:ring-0 cursor-pointer w-3.5 h-3.5 border-slate-300"
                        />
                      </th>

                      {/* 对象信息 (Analysis Group Name) */}
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
                      <th className="py-3 px-4 text-center">
                        <span>操作</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0f2f5] text-slate-700">
                    {currentTableRows.length > 0 ? (
                      currentTableRows.map((row) => {
                        const isChecked = selectedRowIds.includes(row.id);

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-blue-50/20 transition-colors ${
                              isChecked ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleRow(row.id)}
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
                                  <circle cx="3" cy="12" r="1.8" fill="currentColor" />
                                  <circle cx="3" cy="4" r="1.8" fill="currentColor" />
                                  <circle cx="12" cy="8" r="1.8" fill="currentColor" />
                                  <path d="M3 6v4M5 4.5l5 2.5M5 11.5l5-2.5" stroke="currentColor" strokeWidth="1.4" />
                                </svg>
                                <span className="font-medium text-slate-800 hover:text-[#0091ff] cursor-pointer">
                                  {row.name}
                                </span>
                              </div>
                            </td>

                            {/* 主机IP */}
                            <td className="py-4 px-3 font-semibold text-slate-900 tabular-nums">
                              {row.ip || '172.17.3.2'}
                            </td>


                            {/* 总流量 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {row.totalFlow || '13.11 MB'}
                            </td>

                            {/* 速率 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {row.speed || '366.59 Kbps'}
                            </td>

                            {/* 数据包数 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {(row.packetCount || 33517).toLocaleString()}
                            </td>

                            {/* 平均包率 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {row.avgPacketRate || '111.72 pps'}
                            </td>

                            {/* 网络时延 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {row.networkLatency || '4.09 ms'}
                            </td>

                            {/* 响应时间-服务器 */}
                            <td className="py-4 px-3 font-mono text-slate-800 tabular-nums">
                              {row.serverRespTime || '50.09 ms'}
                            </td>

                            {/* 会话状态 (Green 活跃 badge) */}
                            <td className="py-4 px-3">
                              <span className="inline-flex items-center justify-center bg-[#00b42a] text-white text-[11px] font-medium px-3 py-0.5 rounded-xs shadow-2xs">
                                {row.status || '活跃'}
                              </span>
                            </td>

                            {/* 会话开始时间 */}
                            <td className="py-4 px-3 font-mono text-slate-600 text-[11px] tabular-nums">
                              {row.startTime || '2026-11-04 09:35:32.144030'}
                            </td>

                            {/* 最后更新时间 */}
                            <td className="py-4 px-3 font-mono text-slate-600 text-[11px] tabular-nums">
                              {row.lastUpdated || '2026-11-04 17:05:59.991396'}
                            </td>

                            {/* 站点 */}
                            <td className="py-4 px-3 text-slate-600">
                              {row.site || 'Server172.17'}
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
                        <td colSpan={14} className="py-8 text-center text-slate-400">
                          暂无匹配的数据，请在下拉框中选择分析组或输入关键字进行搜索
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Summary Footer */}
              <div className="px-4 py-2 bg-[#fcfdfe] border-t border-[#e5e7eb] flex items-center justify-between text-xs text-slate-500">
                <span>
                  当前中控展示 {currentTableRows.length} 条记录 (已勾选 {selectedRowIds.length} 项)
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
