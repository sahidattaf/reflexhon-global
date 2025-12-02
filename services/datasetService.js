import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

class DatasetService {
  constructor() {
    this.datasetPath = path.join(process.cwd(), 'ai', 'datasets', 'data.jsonl');
  }

  async getAllData() {
    try {
      const content = await fs.readFile(this.datasetPath, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line);
      return lines.map(line => JSON.parse(line));
    } catch (error) {
      logger.error('Error reading dataset', error);
      throw new Error('Failed to retrieve dataset');
    }
  }

  async getDataById(id) {
    try {
      const allData = await this.getAllData();
      return allData.find(item => item.id === id);
    } catch (error) {
      logger.error(`Error retrieving data with id: ${id}`, error);
      throw new Error('Failed to retrieve data item');
    }
  }

  async searchData(query) {
    try {
      const allData = await this.getAllData();
      return allData.filter(item =>
        item.input.toLowerCase().includes(query.toLowerCase()) ||
        item.output.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      logger.error('Error searching dataset', error);
      throw new Error('Failed to search dataset');
    }
  }
}

export default new DatasetService();
