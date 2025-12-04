import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import config from '@config';
import logger from './logger';

export const loadVersionedRoutes = (moduleName: string): Router => {
  const router = Router();

  const modulePath = path.join(__dirname, '../../modules', moduleName);

  if (!fs.existsSync(modulePath)) {
    logger.error(`[loadVersionedRoutes]- Module not found: ${moduleName}`);
  }

  const versions = fs.readdirSync(modulePath).filter(dir =>
    /^v[0-9]+$/i.test(dir)
  );

  let defaultRouterRegistered = false;

  versions.forEach((versionFolder) => {
    const singularName = moduleName.endsWith('ies')
      ? moduleName.slice(0, -3) + 'y'
      : moduleName.endsWith('s')
        ? moduleName.slice(0, -1)
        : moduleName;

    const isProd = config.nodeEnv === 'production';
    const extension = isProd ? '.js' : '.ts';

    const routeFile = path.join(modulePath, versionFolder, `${singularName}.routes${extension}`);


    if (!fs.existsSync(routeFile)) {
      console.warn(`No route file in ${versionFolder} for ${moduleName}`);
      return;
    }

    // ESM dynamic import
    const versionRouter = require(routeFile).default;

    const versionPath = `/${versionFolder.toLowerCase()}`;
    router.use(versionPath, versionRouter);

    // default route points to v1
    if (!defaultRouterRegistered && versionFolder.toLowerCase() === 'v1') {
      router.use('/', versionRouter);
      defaultRouterRegistered = true;
    }
  });

  return router;
};
