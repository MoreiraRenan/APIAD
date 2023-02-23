"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
var ldap = require('ldapjs');
const server_ldap_indra = 'ldap://10.22.1.129';
const user_ldap_indra = 'cn=infra,ou=Usuarios,ou=Infra,ou=Indra,dc=indracampos,dc=local';
const pass_ladp_indra = 'Indra!@123';
const buscar = 'ou=Usuarios,ou=Infra,ou=Indra,dc=indracampos,dc=local';
var client = null;
let AppService = class AppService {
    constructor(config) {
        this.config = config;
        this.authenticateDN();
    }
    authenticateDN() {
        client = ldap.createClient({ url: this.config.get('SERVER_LDAP') });
        client.bind(this.config.get('USER_LDAP'), this.config.get('PASS_LDAP'), function (err) {
            if (err) {
                console.log("AD ......Error in new connetion " + err);
                throw err;
            }
            else {
                console.log("AD ......Success");
            }
        });
    }
    async reset(matricula) {
        try {
            var opts = {
                filter: `(cn=${matricula})`,
                scope: 'sub',
                attributes: ['*']
            };
            return new Promise(async (resolve, rejet) => {
                const ai = await client.search(this.config.get('BUSCA'), opts, (err, res) => {
                    if (err) {
                        console.log("aquiiiiiii");
                        console.log(err);
                        resolve(Object.assign(Object.assign({}, err), { code: 500 }));
                    }
                    else {
                        res.on('searchEntry', async (entry) => {
                            let userDN = entry.object.dn;
                            console.log("kkkkkkkkkkkkkkkkkkkkkkkkk");
                            let cpf = null;
                            let data = null;
                            entry.attributes.forEach((e) => {
                                if (e.type == 'metaCPF') {
                                    cpf = e._vals;
                                    console.log(cpf[0].toString().substr(0, 2));
                                }
                                if (e.type == 'metaBirthDate') {
                                    data = e._vals;
                                    console.log(data[0].toString().substr(6));
                                }
                            });
                            const newSenha = `${Math.round(Math.random() * (9 - 0) + 0)}${Math.round(Math.random() * (9 - 0) + 0)}${Math.round(Math.random() * (9 - 0) + 0)}${Math.round(Math.random() * (9 - 0) + 0)};
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

//}
                            ;
                        });
                    }
                });
            });
        }
        finally { }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map