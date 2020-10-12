import {CognitoUserPool} from 'amazon-cognito-identity-js'

  const poolData = {
    UserPoolId: 'ap-south-1_l5omrDIEp',
    ClientId: '3lpl0pbje4o2fp3kt024kg53jh'
  }

export default new CognitoUserPool(poolData);