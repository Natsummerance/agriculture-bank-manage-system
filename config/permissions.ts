export const rolePermissions = {
  farmer: [
    'farmer.product.view',
    'farmer.product.edit',
    'farmer.order.view',
    'farmer.finance.apply',
  ],
  buyer: [
    'buyer.cart.manage',
    'buyer.order.view',
    'buyer.coupon.use',
  ],
  bank: [
    'bank.approval.view',
    'bank.approval.handle',
    'bank.product.manage',
  ],
  expert: [
    'expert.qa.answer',
    'expert.calendar.manage',
    'expert.content.publish',
  ],
  admin: [
    'admin.user.manage',
    'admin.product.audit',
    'admin.order.monitor',
    'admin.content.audit',
    'admin.role.manage',
  ],
} as const;

export type PermissionCode = (typeof rolePermissions)[keyof typeof rolePermissions][number];


