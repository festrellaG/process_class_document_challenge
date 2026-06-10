import { Router } from 'express';
import { redactChallengeText, unredactChallengeText } from '../controllers/challengeController.js';

const router = Router();

router.post('/challenge/redact', redactChallengeText);
router.post('/challenge/unredact', unredactChallengeText);

export default router;
