import {HttpResponseResolver} from "msw";
import {CheckProofRequest} from "../dto/check-proof-request-dto";
import {TonApiService} from "../services/ton-api-service";
import {TonProofService} from "../services/ton-proof-service";
import {badRequest, ok} from "../utils/http-utils";
import {createAuthToken, verifyToken} from "../utils/jwt";

/**
 * Checks the proof and returns an access token.
 *
 * POST /api/check_proof
 */
export const checkProof: HttpResponseResolver = async ({request}) => {
  try {
    const body = CheckProofRequest.parse(await request.json());

    const client = TonApiService.create(body.network);
    
    const service = new TonProofService();
    console.log('checkProof', body)
    const isValid = await service.checkProof(body, (address) => client.getWalletPublicKey(address));
    console.log('checkProof after', body)
    if (!isValid) {
      return badRequest({error: 'Invalid proof'});
    }

    const payloadToken = body.proof.payload;
    console.log('checkProof', payloadToken)
    if (!await verifyToken(payloadToken)) {
      return badRequest({error: 'Invalid token'});
    }

   
    console.log('checkProof token before')
    const token = await createAuthToken({address: body.address, network: body.network});
    console.log('checkProof')
    return ok({token: token});
  } catch (e) {
    return badRequest({error: 'Invalid request', trace: e});
  }
};
