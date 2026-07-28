import { Router } from 'express';
import {
  getSchemes,
  evaluateEligibility,
  getNearbyFacilities,
  getAiAdvice,
  syncOfflineQueue
} from '../controllers/welfareController';

const router = Router();

// Public / Authenticated Citizen & ASHA endpoints
router.get('/schemes', getSchemes);
router.post('/evaluate-eligibility', evaluateEligibility);
router.get('/nearby-facilities', getNearbyFacilities);
router.post('/ai-advisor', getAiAdvice);
router.post('/sync-offline', syncOfflineQueue);

export default router;
