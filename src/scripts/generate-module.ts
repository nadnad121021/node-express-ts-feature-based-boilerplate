import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';


const moduleName = pluralize.plural(process.argv[2]);

if (!moduleName) {
  console.error('Module name is required. Example: pnpm generate:module bookings');
  process.exit(1);
}

const singular = pluralize.singular(moduleName);
const tableName = moduleName;
const className = singular.charAt(0).toUpperCase() + singular.slice(1);
const modulePath = path.join(process.cwd(), 'src', 'modules', moduleName);

const templates: Record<string, string> = {
  [`${singular}.interface.ts`]: `export interface I${className} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
`,

  [`${singular}.dto.ts`]: `export class Create${className}Dto {}

export class Update${className}Dto {}
`,

  [`${singular}.entity.ts`]: `import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('${tableName}')
export class ${className} {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
`,

  [`${singular}.repository.ts`]: `import { AppDataSource } from '@db';
import { ${className} } from './${singular}.entity';

export const ${className}Repository = AppDataSource.getRepository(${className});
`,

  [`${singular}.service.ts`]: `import { ${className}Repository } from './${singular}.repository';
import { Create${className}Dto, Update${className}Dto } from './${singular}.dto';

class ${className}Service {
  async findAll() {
    return ${className}Repository.find();
  }

  async findById(id: string) {
    return ${className}Repository.findOne({
      where: { id },
    });
  }

  async create(payload: Create${className}Dto) {
    const data = ${className}Repository.create(payload);

    return ${className}Repository.save(data);
  }

  async update(id: string, payload: Update${className}Dto) {
    await ${className}Repository.update(id, payload);

    return this.findById(id);
  }

  async delete(id: string) {
    await ${className}Repository.delete(id);

    return true;
  }
}

export default new ${className}Service();
`,

  [`${singular}.events.ts`]: `export const ${className}Events = {
  CREATED: '${moduleName}.created',
  UPDATED: '${moduleName}.updated',
  DELETED: '${moduleName}.deleted',
} as const;
`,

  [`index.ts`]: `export * from './${singular}.entity';
export * from './${singular}.interface';
export * from './${singular}.dto';
export * from './${singular}.events';
`,

  [`v1/${singular}.controller.ts`]: `import { Request, Response, NextFunction } from 'express';
import ${singular}Service from '../${singular}.service';

class ${className}Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${singular}Service.findAll();

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${singular}Service.findById(req.params.id);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${singular}Service.create(req.body);

      return res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ${singular}Service.update(req.params.id, req.body);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ${singular}Service.delete(req.params.id);

      return res.json({
        success: true,
        message: '${className} deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ${className}Controller();
`,

  [`v1/${singular}.routes.ts`]: `import { Router } from 'express';
import ${singular}Controller from './${singular}.controller';

const router = Router();

router.get('/', ${singular}Controller.getAll);
router.get('/:id', ${singular}Controller.getById);
router.post('/', ${singular}Controller.create);
router.patch('/:id', ${singular}Controller.update);
router.delete('/:id', ${singular}Controller.delete);

export default router;
`,
};

fs.mkdirSync(path.join(modulePath, 'v1'), { recursive: true });

for (const [file, content] of Object.entries(templates)) {
  const filePath = path.join(modulePath, file);

  if (fs.existsSync(filePath)) {
    console.log(`Skipped: ${filePath}`);
    continue;
  }

  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

console.log(`Module "${moduleName}" generated successfully.`);