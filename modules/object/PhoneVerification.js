// ### Controller ###

// modules
const CryptoJS = require('crypto-js');
const axios = require('axios');
const cache = require('memory-cache');

// Services
const UserService = require('../../services/UserService');

// *edit
//  password
//  pin
//  phone
//      => *모두 등록된 핸드폰 번호의 인증을 해야된다. 즉 Validation 모두 일치
//          Validation : 1)계정에 등록된 핸드폰 번호가 아닙니다
//      
//      => *phone 경우만, 기존 핸드폰 인증 후에, 새로운 핸드폰 인증 해야됨
//          두번째 인증은 type : edit_update_phone 사용하기~
//          여기서 Validation으로 1)핸드폰 중복 확인 2)기존 핸드폰 번호

const send_verification_code = function (type) {
  return async function (request, response) {
    try {
        const { phone } = request.body;

        const validationResult = await validation(phone, type, request);
        if(!validationResult.success) return response.send(validationResult);

        const verification_code = generateRandomCode(6);
        cache.del(phone);
        cache.put(phone, verification_code, 60000); //1000 => 1초
        const date = Date.now().toString(); // 날짜 string
  
        const sens_access_key = process.env.SENS_ACCESS_KEY;
        const sens_secret_key = process.env.SENS_SECRET_KEY;
        const sens_service_id = process.env.SENS_SERVICE_ID;
        const sens_call_number = process.env.SENS_CALL_NUMBER;
  
        // url 관련 변수 선언
        const method = "POST";
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
        const url2 = `/sms/v2/services/${sens_service_id}/messages`;
  
        // signature 작성 : crypto-js 모듈을 이용하여 암호화
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(sens_access_key);
        const hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);
  
        // sens 서버로 요청 전송
        axios({
          method: method,
          url: url,
          headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": sens_access_key,
            "x-ncp-apigw-timestamp": date
            ,
            "x-ncp-apigw-signature-v2": signature,
          },
          data: {
            type: "SMS",
            countryCode: "82",
            from: sens_call_number,
            content: `인증번호는 [${verification_code}] 입니다.`,
            messages: [{ to: `${phone}` }],
          },
        });
        response.send({success:true, msg:"인증번호가 전송되었습니다."});

      } catch (err) {
          console.log(err);
          response.send({success:false, msg:"인증번호 전송이 실패하였습니다."});
      }
  
      function generateRandomCode(n) {
          let str = ''
          for (let i = 0; i < n; i++) {
            str += Math.floor(Math.random() * 10);
          }
          return str;
      }
  }
} 

const check_verification_code = function(type) {
  return function (request, response) {
    const { phone, code } = request.body;  
    const cache_data = cache.get(phone);
  
    if (!cache_data) {
      return response.send({success:false, msg:"인증번호가 만료되었습니다."});
    }
    else if (cache_data === code) {
      session(request, phone, type);
      return response.send({success:true, msg:"인증이 완료되었습니다."});
    }
    else {
      return response.send({success:false, msg:"인증번호가 일치하지 않습니다."});
    }
  }
} 

async function validation(phone, type, request) {
  if (!phone) {
    return {success:false, msg:'핸드폰번호를 입력하세요.'};
  } 
  else if (type === 'edit') {
    const user = await UserService.get_user_by_uid(request.user.id);
    if (user.userid !== phone) {
      return {success:false, msg:'계정에 등록된 전화번호가 아닙니다.'};
    } 
  }
  else if (type === 'edit_phone') {
    const user = await UserService.get_user_by_uid(request.user.id);
    if (user.userid === phone) {
      return {success:false, msg:'기존 핸드폰번호와 동일합니다.'};
    } 
    if (await UserService.isDuplicate('userid', phone)) {
      return {success:false, msg:'이미 등록된 전화번호입니다.'};
    } 
  }
  // else if (type === 'login_edit_password' && !(await UserService.isDuplicate('phone', phone))) {
  //   return {success:false, msg:'등록된 핸드폰번호가 없습니다.'};
  // }
  // else if (type === 'register' && await UserService.isDuplicate('userid', phone)) {
  //   return {success:false, msg:'이미 등록된 전화번호입니다.'};
  // }
  // else if (type === 'mypage_edit_phone') {
  //   const user = await UserService.get_user_by_uid(request.user.id);
  //   if (user.phone === phone) {
  //     return {success:false, msg:'기존 핸드폰번호와 동일합니다.'};
  //   } 
  //   if (await UserService.isDuplicate('phone', phone)) {
  //     return {success:false, msg:'이미 등록된 전화번호입니다.'};
  //   } 
  // }
  // else if (type === 'mypage_edit_password' || type === 'mypage_edit_pin') {
  //   const user = await UserService.get_user_by_uid(request.user.id);
  //   if (user.phone !== phone) {
  //     return {success:false, msg:'해당 계정에 등록된 핸드폰번호가 아닙니다.'};
  //   }
  // }
  return {success:true};
}

function session(request, phone, type) {
  if (type !== 'edit') request.session[type].phone = phone;
  // if (type === 'register') request.session.register.phone = phone;
  // else if (type === 'mypage_edit_phone') request.session.mypage_edit_phone.phone = phone;
  // else if (type === 'mypage_edit_password') request.session.mypage_edit_password.phone = phone;
  // else if (type === 'mypage_edit_pin') request.session.mypage_edit_pin.phone = phone;
  // else if (type === 'login_edit_password') request.session.login_edit_password.phone = phone;
}

module.exports = { send_verification_code, check_verification_code }