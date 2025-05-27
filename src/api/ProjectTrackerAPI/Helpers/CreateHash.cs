using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace ProjectTrackerAPI.Helpers{
    public static class CreateHash{
        public static void CreatePaswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) {
        using (var hmac = new HMACSHA512()){
             passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
       

    }

    public static bool VerifyPasswordHas( string enteredPassWord, byte[] storedHashPassword, byte[] storedSalt){
        using (var hmac = new HMACSHA512(storedSalt)){
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(enteredPassWord));
            return computedHash.SequenceEqual(storedHashPassword);
        }
    }

}

    
}