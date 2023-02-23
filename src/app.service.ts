import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
var ldap = require('ldapjs');
const server_ldap_indra = 'ldap://10.22.1.129';
const user_ldap_indra = 'cn=infra,ou=Usuarios,ou=Infra,ou=Indra,dc=indracampos,dc=local';
const pass_ladp_indra = 'Indra!@123';
const buscar = 'ou=Usuarios,ou=Infra,ou=Indra,dc=indracampos,dc=local'

var client = null

@Injectable()

export class AppService {
  constructor(public config: ConfigService) {
    this.authenticateDN()
  }

  authenticateDN()  {
    client= ldap.createClient({url: this.config.get('SERVER_LDAP')});
    client.bind(this.config.get('USER_LDAP'), this.config.get('PASS_LDAP'), function (err) {
        if (err) {
            console.log("AD ......Error in new connetion " + err)
            throw err
        } else {
            /*if connection is success then go for any operation*/
            console.log("AD ......Success");
            //searchUser();
        }
    });
    // client.close;
}

async reset(matricula : string) : Promise<any>  {
  try {
 var opts = {
      filter: `(cn=${matricula})`,
      scope: 'sub',
      attributes: ['*']
  };
  return new Promise(async (resolve, rejet) => {
     const ai = await client.search(this.config.get('BUSCA'),opts,  (err, res)=> {
      if (err) {
	console.log("aquiiiiiii")
	console.log(err)
        resolve({...err,code:500})
      } else {
          res.on('searchEntry', async (entry) => {
            let userDN = entry.object.dn;
	    console.log("kkkkkkkkkkkkkkkkkkkkkkkkk")
		let cpf = null
		let data = null
		 entry.attributes.forEach((e)=>{
		if(e.type == 'metaCPF'){
		cpf = e._vals
		console.log(cpf[0].toString().substr(0,2))
		}
		if(e.type == 'metaBirthDate'){
		data = e._vals
		console.log(data[0].toString().substr(6))
		}
		})
	    //console.log(entry.attributes)
            const newSenha = `${Math.round(Math.random() * (9-0) +0)}${Math.round(Math.random() * (9-0) +0)}${Math.round(Math.random() * (9-0) +0)}${Math.round(Math.random() * (9-0) +0)};
	       await client.modify(userDN, [
               new ldap.Change({
                   operation: 'replace',
                   modification: {
                    userPassword: this.config.get('PADRAO_PASSWORD') + newSenha
                   }
               })
           ], (err)=> {
		console.log(err);
	       if (err) {
		console.log("erro")
               resolve({...err,code:500})
               }
               else {
		console.log("senha")
		console.log(newSenha);
                resolve({code:200,senha:newSenha})
               }
           });

          });
          res.on('searchReference',  (referral) =>{
              console.log('referral: ' + referral.uris.join());
          });
          
	res.on('error',  (err)=> {
	console.log("eqoo a	ui")
            resolve({...err,code:500})
          });
         
	res.on('end',  (result)=> {
		resolve('fim');
          });
      }
  })
})
} catch (error) {
    return error
}
}

}
