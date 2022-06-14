export class GenericResponseDto{

    statusCode:number
    message:string
    response:any
    constructor(statusCode:number,message:string,respnose?:any){
        this.statusCode=statusCode
        this.message=message
        this.response=respnose
    }
    
}