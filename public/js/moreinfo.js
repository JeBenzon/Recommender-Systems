function showMoreInfo(userInfoString){
    let userInfo = userInfoString.split(" ")
    switch (userInfo[2]) {
        case 'm':
            userInfo[2] = 'Male'
            break;
        case 'f':
            userInfo[2] = 'Female'
            break;
        default:
            userInfo[2] = 'Other'
            break;
    }
    alert('Userinfo:\n' + 'Name: ' + userInfo[0] + '\nAge: ' + userInfo[1] + '\nGender: ' + userInfo[2])
  }