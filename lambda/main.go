package main

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handle(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	// lc, _ := lambdacontext.FromContext(ctx)

	// log.Println(lc.AwsRequestID)

	// log.Panicln(request.Body)

	return events.APIGatewayV2HTTPResponse{
		StatusCode: http.StatusOK,
		Body:       "Hello Lambda",
	}, nil
}

func main() {
	lambda.Start(Handle)
}
