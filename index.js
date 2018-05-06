#!/usr/bin/env node

/**
* Module dependencies and files from other folders
*/

const program = require('commander')
const game = require('./scripts/game')
const online = require('./online/client')
const {prompt} = require('inquirer')
const crypto = require('crypto')
const chalk = require('chalk')

/**
 * setting questions for online mode
*/

const question1 = [{
  type : 'confirm',
  name: 'join',
  message: 'Are you starting server for race ?',
  default: false
}]

const question2 = [
  {
    type: 'input',
    name: 'username',
    message: 'Enter Username',
    validate: function (value) {
      if (!value) {
        return 'Please enter Username'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'roomNumber',
    message: 'Enter room address that you got above',
    validate: function (value) {
      if (!value) {
        return 'Please enter room address'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'number',
    message: 'Enter number of players (max 5)',
    validate: function (value) {
      if (value > 5) {
        return 'Cannot exceed 5'
      } else if (!value) {
        return 'Please enter a value'
      } else if (isNaN(value) === true) {
        return 'Please enter number only'
      }
      return true
    }
  }
]

program
  .command('practice')
  .alias('p')
  .description('Start typeracer')
  .action(() => {
      game()
  })

program
  .command('online')
  .alias('o')
  .description('Start game in online mode')
  .option('-f, --friendly', 'Start playing online mode among friends (max 5)')
  .action((options)=>{
    if (options.friendly) {
      prompt(question1).then(answers => {
        if(answers.join === true) {
          // Generating random channel
          const roomNumber = crypto
            .randomBytes(12)
            .toString('base64')
            .replace(/[+/=]+/g, '')

          console.log(chalk.cyan(`Your room number is: ${roomNumber} `))
          prompt(question2).then(answers => {
            console.log('Connecting.....')
            online(answers)
          })
        }
      })
    }
  })

program.parse(process.argv)
