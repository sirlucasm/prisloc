import { PrislocClient } from 'prisloc'
import config from './prisloc/config'

const prisClient = new PrislocClient(config)

console.log('department')

async function main() {
  // creating department
  const department = await prisClient.create('Department', {
    code: 'IT',
    name: 'Tecnologia da Informação',
  })

  // creating user with department relation
  const user = await prisClient.create('User', {
    name: 'João Silva',
    department: department.code,
  })

  console.log(department)
  console.log(user)
}

main()
