import sql from "mssql";

class userManager{
    sql;

    constructor(){
        this.sql = sql;
    }

    async createNewUser(firebaseId) {
        try {
            const request = new this.sql.Request();
            request.input('firebaseId', this.sql.NVarChar, firebaseId);
            const result = await request.query(
                'INSERT INTO dbo.userData (firebaseId) VALUES (@firebaseId)'
            );
            return result;
        } catch (error) {
            console.log('Error in creating new user:', error);
            throw error;
    }
}

}

export default userManager;