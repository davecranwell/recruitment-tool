export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  swagger: {
    enabled: true,
    title: 'Recruiting tool',
    description: '',
    version: '1.0',
    path: 'api',
  },
})
