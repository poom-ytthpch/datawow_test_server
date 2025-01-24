import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

import { Injectable } from '@nestjs/common'
import { ConfigType } from 'src/types/config'


@Injectable()
export class ConfigService {
  private static config: ConfigType

  static load() {
    if (this.config) {
      return this.config
    }

    const configPath = path.resolve('config.yaml')
    // console.log({ configPath })

    if (!fs.existsSync(configPath)) {
      if (process.env.NODE_ENV === 'test') {
        return null
      }

      throw new Error('Missing config.yaml!!')
    }

    this.config = yaml.load(fs.readFileSync(configPath, 'utf8'))

    if (process.env.NODE_ENV === 'development') {
      console.log('Config loaded successfully', { config: this.config })
    } else {
      console.log('Config loaded successfully')
    }


    return this.config
  }
}