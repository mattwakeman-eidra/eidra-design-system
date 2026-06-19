import { libConfig } from '../../vite.config.base';

export default libConfig({
  root: import.meta.url,
  external: [/^react($|\/)/, /^react-dom($|\/)/, 'lucide-react', /^country-flag-icons($|\/)/],
});
