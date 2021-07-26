const { REGION } = require('../Credentials/libs/stsClient.js');
const {
  APIGatewayClient,
  GetRestApisCommand,
  GetResourcesCommand,
  GetIntegrationCommand,
  GetUsagePlansCommand,
} = require('@aws-sdk/client-api-gateway');

const getAPIData = async (req, res, next) => {
  const client = new APIGatewayClient({
    region: REGION,
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
      // for (let k = 0; k < apiData[i].resources.length; k += 1) {
      //   const apiResource = apiData[i].resources[k];
      //   for (let m = 0; m < apiResource.methodsArr.length; m += 1) {
      //     const method = apiResource.methodsArr[m];
      //     console.log('method: ', method, ' from ', apiResource);
      //     console.log(apiData[0]);
      //     console.log(apiData[1]);
      //   }
      // }
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
                  uri: integrationData.uri,
                };
                currResource.methods.push(currMethodObj);
              } catch (err) {
                console.log('Error after integration attempt: ', err.stack);
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.log('Error after try/catch: ', err);
  }
  //   console.log(apiData[1]);
  //   const refreshProfitsIntegration = await client.send(
  //     new GetIntegrationCommand({
  //       restApiId: '3mi5k0hgr1',
  //       resourceId: 'tq2zyj',
  //       httpMethod: 'GET',
  //     })
  //   );
  //   if (!refreshProfitsIntegration) {
  //     console.log('moving on');
  //   }
  //   console.log(refreshProfitsIntegration);

  // console.log('returned object: ', apiData);

  //   const secondResource = await client.send(
  //     new GetResourcesCommand({ restApiId: '3mi5k0hgr1' })
  //   );
  //   console.log(secondResource);
  //   console.log(secondResource.items[0].resourceMethods);
  //   console.log(secondResource.items[7].resourceMethods);
  res.locals.apiData = apiData;
  return next();
};

module.exports = getAPIData;
