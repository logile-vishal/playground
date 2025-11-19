import React from 'react';

export type IconName =
  | 'Afternoon'
  | 'Announcement'
  | 'Attachment'
  | 'Camera'
  | 'Cleaning'
  | 'ComposeMessage'
  | 'ContactList'
  | 'Corporate'
  | 'Crop'
  | 'Delete'
  | 'Districts'
  | 'Evening'
  | 'Expired'
  | 'Forward'
  | 'Pending'
  | 'GridView'
  | 'HeartbeatTask'
  | 'ListView'
  | 'Mail'
  | 'Morning'
  | 'News'
  | 'OutOfCompliance'
  | 'PartyBag'
  | 'Path36'
  | 'PdfSolid'
  | 'Reply'
  | 'ReportCard'
  | 'Send'
  | 'ShopSupply'
  | 'Smiley'
  | 'StoreTalk'
  | 'StoreTrolly'
  | 'Thermometer'
  | 'Violation';

export const oldTemplateIcons = {
  'afternoon': React.lazy(() => import('@/assets/icons/old-template-icons/afternoon.svg?react')),
  'announcement': React.lazy(() => import('@/assets/icons/old-template-icons/announcement.svg?react')),
  'attachment': React.lazy(() => import('@/assets/icons/old-template-icons/attachment.svg?react')),
  'camera': React.lazy(() => import('@/assets/icons/old-template-icons/camera.svg?react')),
  'cleaning': React.lazy(() => import('@/assets/icons/old-template-icons/cleaning.svg?react')),
  'compose-message': React.lazy(() => import('@/assets/icons/old-template-icons/compose-message.svg?react')),
  'contact-list': React.lazy(() => import('@/assets/icons/old-template-icons/contact-list.svg?react')),
  'corporate': React.lazy(() => import('@/assets/icons/old-template-icons/corporate.svg?react')),
  'crop': React.lazy(() => import('@/assets/icons/old-template-icons/crop.svg?react')),
  'delete': React.lazy(() => import('@/assets/icons/old-template-icons/delete.svg?react')),
  'districts': React.lazy(() => import('@/assets/icons/old-template-icons/districts.svg?react')),
  'evening': React.lazy(() => import('@/assets/icons/old-template-icons/evening.svg?react')),
  'expired': React.lazy(() => import('@/assets/icons/old-template-icons/expired.svg?react')),
  'forward': React.lazy(() => import('@/assets/icons/old-template-icons/forward.svg?react')),
  'pending': React.lazy(() => import('@/assets/icons/old-template-icons/pending.svg?react')),
  'grid-view': React.lazy(() => import('@/assets/icons/old-template-icons/grid-view.svg?react')),
  'heartbeat-task': React.lazy(() => import('@/assets/icons/old-template-icons/heartbeat-task.svg?react')),
  'list-view': React.lazy(() => import('@/assets/icons/old-template-icons/list-view.svg?react')),
  'mail': React.lazy(() => import('@/assets/icons/old-template-icons/mail.svg?react')),
  'morning': React.lazy(() => import('@/assets/icons/old-template-icons/morning.svg?react')),
  'news': React.lazy(() => import('@/assets/icons/old-template-icons/news.svg?react')),
  'out-of-compliance': React.lazy(() => import('@/assets/icons/old-template-icons/out-of-compliance.svg?react')),
  'party-bag': React.lazy(() => import('@/assets/icons/old-template-icons/party-bag.svg?react')),
  'path-36': React.lazy(() => import('@/assets/icons/old-template-icons/path-36.svg?react')),
  'pdf-solid': React.lazy(() => import('@/assets/icons/old-template-icons/pdf-solid.svg?react')),
  'reply': React.lazy(() => import('@/assets/icons/old-template-icons/reply.svg?react')),
  'report-card': React.lazy(() => import('@/assets/icons/old-template-icons/report-card.svg?react')),
  'send': React.lazy(() => import('@/assets/icons/old-template-icons/send.svg?react')),
  'shop-supply': React.lazy(() => import('@/assets/icons/old-template-icons/shop-supply.svg?react')),
  'smiley': React.lazy(() => import('@/assets/icons/old-template-icons/smiley.svg?react')),
  'store-talk': React.lazy(() => import('@/assets/icons/old-template-icons/store-talk.svg?react')),
  'store-trolly': React.lazy(() => import('@/assets/icons/old-template-icons/store-trolly.svg?react')),
  'thermometer': React.lazy(() => import('@/assets/icons/old-template-icons/thermometer.svg?react')),
  'violation': React.lazy(() => import('@/assets/icons/old-template-icons/violation.svg?react'))
};
