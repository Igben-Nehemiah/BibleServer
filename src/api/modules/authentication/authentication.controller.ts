import * as express from "express";
import IController from "../../common/controller/controller.interface";
import AuthenticationService from "./authentication.service";
import CreateUserDto from "./dtos/create-user.dto";
import LoginDto from "./dtos/login.dto";
import { HttpException } from "../../common/errors/custom-error";
import { Ok } from "../../common/responses";
import { RequestWithUser } from "./interfaces";
import { authenticationMiddleware, validationMiddleware } from "../../middlewares";

class AuthenticationController implements IController {
    public router = express.Router();
    public path = "/auth";

    constructor(private readonly authService: AuthenticationService) {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.logIn);
        this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto), this.registerUser);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/2fa/generate`, authenticationMiddleware, this.generateTwoFactorAuthenticationCode);
    };

    private registerUser = async (request: express.Request, 
        response: express.Response,
        next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;

        const result = await this.authService.registerUser(userData);

        result.match(
            value => {
                response.setHeader("Set-Cookie", [value.cookie])
                return response.status(201).json(new Ok(value.user, 201));
            },
            error => { throw new HttpException(error.message || "", 400) }
        );
    };
    
    private logIn = async (request: express.Request, 
        response: express.Response,
        next: express.NextFunction) => {
        
        const userData: LoginDto = request.body;

        const result = await this.authService.login(userData);

        result.match(
            value => {
                response.setHeader("Set-Cookie", [result.value.cookie])
                return response.status(200).json(new Ok(result.value.user));
            },
            error => { throw new HttpException(error.message || "", 400) }
        );
    };

    private logout = async (request: RequestWithUser, 
        response: express.Response,
        next: express.NextFunction) => {
        
        response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    };

    private generateTwoFactorAuthenticationCode = async (
        request: RequestWithUser,
        response: express.Response,
        next: express.NextFunction
      ) => {
        const user = request.user;
        const otpauthUrl = await this.authService.generateTwoFactorAuthenticationCode(user!);
        this.authService.respondWithQRCode(otpauthUrl!, response);
      };
};

export default AuthenticationController;