'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Command,
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Plus,
  Check,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';
import type { SiteSettings } from '@/types';
export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="availability">
            <span /> NAVONIXX · DIGITAL PRODUCT STUDIO
          </span>
          <h1>
            {settings.headline.split('\n').map((line, i) => (
              <span key={line} className={i === 1 ? 'gradient-text' : ''}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <p>{settings.description}</p>
          <div className="button-row">
            <Link href="/projects" className="button button-primary">
              Explore our work
            </Link>
            <Link href="/contact" className="button button-outline">
              Let’s work together
            </Link>
          </div>
          <Link className="hero-tertiary" href="/products">
            Explore the SaaS collection <span>↗</span>
          </Link>
          <div className="hero-signature">
            <div className="signature-avatar">
              <Image src="/brand/navonixx-logo.png" alt="Navonixx" width={40} height={40} />
            </div>
            <div>
              <strong>Dream it. Design it. Build it.</strong>
              <span>Turning complex ideas into simple experiences.</span>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="hero-visual"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <div className="visual-glow" />
        <div className="dashboard-preview">
          <div className="preview-toolbar">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>
            <span>orbit.app / workspace</span>
            <Command size={12} />
          </div>
          <div className="dashboard-inner">
            <aside className="preview-sidebar">
              <strong>
                <span className="orbit-logo">◈</span> orbit
              </strong>
              <div className="preview-nav selected">
                <LayoutDashboard size={13} />
                Overview
              </div>
              <div className="preview-nav">
                <FolderKanban size={13} />
                Projects
              </div>
              <div className="preview-nav">
                <BarChart3 size={13} />
                Analytics
              </div>
              <div className="preview-nav">
                <Settings size={13} />
                Settings
              </div>
              <div className="sidebar-bottom">
                YOUR WORKSPACE
                <br />
                <span>Make room for great work.</span>
              </div>
            </aside>
            <div className="preview-main">
              <div className="preview-title">
                <div>
                  <span>YOUR WORKSPACE, REIMAGINED</span>
                  <h3>
                    Good morning, Alex <span>✦</span>
                  </h3>
                  <p>Let’s make something great today.</p>
                </div>
                <div className="preview-add">
                  <Plus size={12} />
                  New project
                </div>
              </div>
              <div className="preview-stats">
                {[
                  ['Active projects', '12', '+ 2 this month'],
                  ['Tasks completed', '84', 'On the right track'],
                  ['Focus time', '32h', 'A productive week'],
                ].map(([label, value, note]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{note}</small>
                  </div>
                ))}
              </div>
              <div className="chart-panel">
                <div>
                  <strong>Project activity</strong>
                  <span>
                    This week <MoreHorizontal size={13} />
                  </span>
                </div>
                <div className="bar-chart">
                  {[36, 58, 45, 78, 55, 86, 68, 94, 74, 100, 84, 115].map((height, i) => (
                    <div key={i} style={{ height }}>
                      <i />
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                </div>
              </div>
              <div className="preview-projects">
                <strong>Recent projects</strong>
                {[
                  ['Brand website', 'Design', 'purple'],
                  ['Product dashboard', 'Development', 'blue'],
                ].map(([title, status, color]) => (
                  <div key={title}>
                    <span className={`mini-square ${color}`} />
                    <span>{title}</span>
                    <small>{status}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="floating-build">
          <div className="float-icon">
            <Check size={18} />
          </div>
          <div>
            <strong>Built with intention</strong>
            <span>Every detail. Every interaction.</span>
          </div>
        </div>
        <div className="floating-ai">
          <Sparkles size={18} />
          <div>
            <strong>AI meets great engineering</strong>
            <span>Thoughtful by design.</span>
          </div>
        </div>
        <span className="visual-caption">ILLUSTRATIVE PRODUCT CONCEPT · NOT LIVE CLIENT DATA</span>
      </motion.div>
    </section>
  );
}
