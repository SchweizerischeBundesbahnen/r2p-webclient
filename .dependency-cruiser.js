/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ── Layer rules ────────────────────────────────────────────────────────────
    {
      name: 'no-core-to-pages',
      severity: 'error',
      comment: 'core must not import from pages',
      from: { path: '^src/app/core/' },
      to: { path: '^src/app/pages/' },
    },
    {
      name: 'no-shared-to-core',
      severity: 'error',
      comment: 'shared must not import from core',
      from: { path: '^src/app/shared/' },
      to: { path: '^src/app/core/' },
    },
    {
      name: 'no-shared-to-pages',
      severity: 'error',
      comment: 'shared must not import from pages',
      from: { path: '^src/app/shared/' },
      to: { path: '^src/app/pages/' },
    },

    // ── Cross-page isolation ───────────────────────────────────────────────────
    // Each page may only import from core and shared, never from a sibling page.
    ...[
      'create-train',
      'edit-train',
      'not-found',
      'read-train',
      'traffic',
      'traffic-overview',
    ].map((page) => ({
      name: `no-cross-page-from-${page}`,
      severity: 'error',
      comment: `${page} must not import from other pages`,
      from: { path: `^src/app/pages/${page}/` },
      to: { path: '^src/app/pages/', pathNot: `^src/app/pages/${page}/` },
    })),

    // ── General health ─────────────────────────────────────────────────────────
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies make modules harder to reason about',
      from: {},
      to: { circular: true },
    },
  ],

  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/[^/]+' },
      archi: {
        collapsePattern: '^src/app/(pages/[^/]+|core|shared)',
      },
    },
  },
};
