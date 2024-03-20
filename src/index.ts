import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './db/database';
// import { CreateAndInitializeDatasource } from './db/database';

async function main() {
  try {
    await AppDataSource.initialize();
    // await CreateAndInitializeDatasource();
    console.log('Database connected...');

    const appListener = app.listen(app.get('port'), () => {
      console.log(
        `Server is running on port: ${app.get('port')}`,
      );
    });

    // Apagado satisfactorio con SIGINT o SIGTERM...
    process.on('SIGINT', () => {
      console.log(
        'Received SIGINT signal, shutting down...',
      );
      appListener.close();
    });
  } catch (error) {
    console.error(error);
  }
}

main();
