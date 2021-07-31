const {
  APIGatewayClient,
  GetRestApisCommand,
  GetResourcesCommand,
  GetIntegrationCommand,
  GetUsagePlansCommand,
} = require('@aws-sdk/client-api-gateway');

const getAPIData = async (req, res, next) => {
  const client = new APIGatewayClient({
    region: req.body.region,
    credentials: req.body.credentials,
  });
  const apiData = [];
  // Retrieves list of Rest APIs and their names, i.e. 'Crypto' and 'WildRydes' plus their ids
  try {
    const restAPIs = await client.send(new GetRestApisCommand({}));

    //   console.log('api keys: ', restAPIs);
    restAPIs.items.forEach((api) => {
      apiObj = { name: api.name, apiId: api.id, resources: [] };
      apiData.push(apiObj);
    });

    for (let i = 0; i < apiData.length; i += 1) {
      const resources = await client.send(
        new GetResourcesCommand({ restApiId: apiData[i].apiId })
      );
      // gives array of Items
      for (let j = 0; j < resources.items.length; j += 1) {
        const resourceEl = {
          resourceId: resources.items[j].id,
          path: resources.items[j].path,
        };
        if (resources.items[j].resourceMethods) {
          resourceEl.methodsArr = Object.keys(
            resources.items[j].resourceMethods
          );
        } else {
          resourceEl.methodsArr = undefined;
        }

        apiData[i].resources.push(resourceEl);
      }
    }

    for (let j = 0; j < apiData.length; j += 1) {
      const currApi = apiData[j];
      for (let k = 0; k < currApi.resources.length; k += 1) {
        const currResource = currApi.resources[k];
        if (currResource.methodsArr) {
          currResource.methods = [];
          for (let m = 0; m < currResource.methodsArr.length; m += 1) {
            const currHttpMethod = currResource.methodsArr[m];

            if (currHttpMethod !== 'OPTIONS') {
              try {
                const integrationData = await client.send(
                  new GetIntegrationCommand({
                    restApiId: currApi.apiId,
                    resourceId: currResource.resourceId,
                    httpMethod: currHttpMethod,
                  })
                );
                currMethodObj = {
                  method: currHttpMethod,
                  type: integrationData.type,
                };
                if (integrationData.uri.includes('lambda')) {
                  const cutString = integrationData.uri.slice(
                    integrationData.uri.indexOf('function:')
                  );
                  const lambdaFunc = cutString.slice(9).slice(0, -12);
                  currMethodObj.service = 'Lambda';
                  currMethodObj.endPoint = lambdaFunc;
                } else if (integrationData.uri.includes('dynamodb')) {
                  currMethodObj.service = 'DynamoDB';
                }
                currResource.methods.push(currMethodObj);
              } catch (err) {
                console.log('Error after integration attempt: ', err.stack);
              }
            }
          }
        }
        if (!currResource.methods || currResource.methods.length === 0) {
          console.log(currResource);
          delete currResource.methods;
        }
      }
    }
  } catch (err) {
    console.log('Error after try/catch: ', err);
  }
  res.locals.apiData = apiData;
  return next();
};

module.exports = getAPIData;
