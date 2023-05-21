import AuthenticationService from "../authentication.service"
import { TokenData } from "../interfaces";
import IAuthenticationRepository from "../interfaces/authentication-repository.interface";

const authRepository : IAuthenticationRepository = {
    add: jest.fn().mockReturnValue({}),
    findUserByEmail: jest.fn().mockReturnValue({
        _id: "61505d4e7a7e6c001f2ce301",
        name: "Test Test",
        email: "test@test.com",
    }),
    getAll: jest.fn().mockReturnValue({}),
    getById: jest.fn().mockReturnValue({}),
    remove: jest.fn().mockReturnValue({}),
}


describe("The AuthenticationService", () => {
    const authenticationService = new AuthenticationService(authRepository);
    describe("When creating a cookie", () => {
        const tokenData: TokenData = {
            token: "",
            expiresIn: 1
        };

        it("should return a string", () => {
            expect(typeof authenticationService.createCookie(tokenData))
                .toEqual("string");
        })
    })
})