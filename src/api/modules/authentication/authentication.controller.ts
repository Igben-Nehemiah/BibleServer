import * as express from "express";
import IController from "../../common/controller/controller.interface";
import AuthenticationService from "./authentication.service";
import CreateUserDto from "./dtos/create-user.dto";
import LoginDto from "./dtos/login.dto";
import { HttpException } from "../../common/errors/custom-error";
import validationMiddleware from "../../middlewares/validation.middleware";
import SuccessResult from "../../common/results/success.result";

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
    };

    private registerUser = async (request: express.Request, 
        response: express.Response,
        next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;

        const result = await this.authService.registerUser(userData);

        result.match(
            value => {
                response.setHeader("Set-Cookie", [result.value.cookie])
                return response.status(201).json(new SuccessResult(result.value.user));
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
                return response.status(201).json(new SuccessResult(result.value.user));
            },
            error => { throw new HttpException(error.message || "", 400) }
        );
    };

    private logout = async (request: express.Request, 
        response: express.Response,
        next: express.NextFunction) => {
        
        response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    }
};

export default AuthenticationController;