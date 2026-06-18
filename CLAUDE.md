## Performance Optimization

When optimizing:
- Create backup branch first
- Add compression (vercel.json), caching (next.config.js), lazy loading, dynamic imports, defer scripts
- Run build/lint/test after each change
- Revert if broken, document issues
- Target: TBT <200ms, LCP <1.5s, page size <500KB
- gzip compression on server side
- compress all the files
- dont break the UI or the UX 
