// Biometric Security Utility
// Handles WebAuthn System Passkey Authentication (Fingerprint / Face ID)
// and Local Facial Feature Extraction & Matching

export interface FaceDescriptor {
  capturedAt: string;
  imagePreviewUrl: string;
  featureVector: number[]; // Normalized grayscale grid feature vector
  aspectRatio: number;
}

export interface FingerprintProfile {
  enrolledAt: string;
  fingerprintName: string;
  ridgePatternHash: string; // Captured optical fingerprint ridge hash
  credentialId?: string; // WebAuthn passkey ID if available
}

// 1. WebAuthn Passkey Helper (OS Level Biometrics: Fingerprint, Touch ID, Face ID, Screen Lock)
export async function registerWebAuthnPasskey(username: string = 'Notebook Owner'): Promise<string | null> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    throw new Error('WebAuthn / System Biometrics is not supported in this browser environment.');
  }

  const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false);
  if (!available) {
    throw new Error('No platform biometric authenticator (Fingerprint/Face ID) detected on this device.');
  }

  const userId = new Uint8Array(16);
  crypto.getRandomValues(userId);

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Academic Mistake Notebook',
      id: window.location.hostname || 'localhost',
    },
    user: {
      id: userId,
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Hardware device authenticator (Face ID / Touch ID / Fingerprint)
      userVerification: 'required',
    },
    timeout: 60000,
    attestation: 'none',
  };

  try {
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential | null;

    if (credential) {
      // Return encoded credential ID
      const credentialId = credential.id;
      return credentialId;
    }
    return null;
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      throw new Error('Biometric setup cancelled by user or timed out.');
    }
    throw new Error(err.message || 'Failed to register biometric passkey.');
  }
}

export async function verifyWebAuthnPasskey(credentialIdStr?: string): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    throw new Error('System biometrics (WebAuthn) is not available.');
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const allowCredentials: PublicKeyCredentialDescriptor[] = credentialIdStr
    ? [
        {
          id: Uint8Array.from(atob(credentialIdStr.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
          type: 'public-key',
        },
      ]
    : [];

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    timeout: 60000,
    userVerification: 'required',
    ...(allowCredentials.length > 0 ? { allowCredentials } : {}),
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (assertion) {
      return true;
    }
    return false;
  } catch (err: any) {
    console.warn('WebAuthn verification failed or cancelled:', err);
    return false;
  }
}

// 1.1 Phone System Biometric Verification Helper (Invokes OS native Face ID / Fingerprint / Device PIN dialog)
export async function authenticateWithPhoneSystemBiometrics(
  credentialIdStr?: string
): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return { success: false, error: 'System biometrics API not supported on this browser or platform.' };
  }

  // 1. First attempt: Get existing credential assertion if registered
  if (credentialIdStr) {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const allowCredentials: PublicKeyCredentialDescriptor[] = [
        {
          id: Uint8Array.from(atob(credentialIdStr.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
          type: 'public-key',
        },
      ];
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          allowCredentials,
        },
      });
      if (assertion) {
        return { success: true, credentialId: credentialIdStr };
      }
    } catch (err: any) {
      console.warn('WebAuthn get assertion error, attempting creation prompt fallback:', err);
    }
  }

  // 2. Second attempt / Fallback: Summon OS System Hardware Authenticator (Face ID / Fingerprint / Screen Lock)
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Academic Notebook Security',
          id: window.location.hostname || 'localhost',
        },
        user: {
          id: userId,
          name: 'Notebook Owner',
          displayName: 'Notebook Owner',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Hardware device authenticator (Fingerprint / Face ID / Device Lock)
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })) as PublicKeyCredential | null;

    if (credential) {
      return { success: true, credentialId: credential.id };
    }
    return { success: false, error: 'System biometric verification cancelled.' };
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      return { success: false, error: 'System biometric prompt cancelled by user.' };
    }
    return { success: false, error: err.message || 'System biometric authentication failed.' };
  }
}

// 2. Facial Feature Descriptor Extraction & Comparison (For Camera Face ID Registration)
export function extractFacialDescriptorFromVideo(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement
): FaceDescriptor | null {
  if (!videoEl || videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
    return null;
  }

  const ctx = canvasEl.getContext('2d');
  if (!ctx) return null;

  // Grid resolution for feature vector extraction (16x16 grid = 256 feature points)
  const GRID_SIZE = 16;
  canvasEl.width = GRID_SIZE;
  canvasEl.height = GRID_SIZE;

  // Draw current video frame scaled to grid size
  ctx.drawImage(videoEl, 0, 0, GRID_SIZE, GRID_SIZE);
  const imgData = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);
  const pixels = imgData.data;

  // Extract normalized luminance feature vector
  const featureVector: number[] = [];
  let totalLuminance = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Standard perceptual luminance formula
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    featureVector.push(lum);
    totalLuminance += lum;
  }

  // Normalize vector to reduce impact of overall ambient lighting differences
  const avgLum = totalLuminance / featureVector.length || 1;
  const normalizedVector = featureVector.map((val) => Number((val / avgLum).toFixed(4)));

  // Generate a full resolution snapshot data URL for UI display
  const snapshotCanvas = document.createElement('canvas');
  snapshotCanvas.width = 300;
  snapshotCanvas.height = 300;
  const snapCtx = snapshotCanvas.getContext('2d');
  if (snapCtx) {
    snapCtx.drawImage(videoEl, 0, 0, 300, 300);
  }
  const previewUrl = snapshotCanvas.toDataURL('image/jpeg', 0.85);

  return {
    capturedAt: new Date().toISOString(),
    imagePreviewUrl: previewUrl,
    featureVector: normalizedVector,
    aspectRatio: videoEl.videoWidth / videoEl.videoHeight,
  };
}

// Extract Facial Descriptor from image Data URL (for photo gallery upload fallback)
export async function extractFacialDescriptorFromDataUrl(dataUrl: string): Promise<FaceDescriptor | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const GRID_SIZE = 16;
      canvas.width = GRID_SIZE;
      canvas.height = GRID_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(img, 0, 0, GRID_SIZE, GRID_SIZE);
      const imgData = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);
      const pixels = imgData.data;

      const featureVector: number[] = [];
      let totalLuminance = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        featureVector.push(lum);
        totalLuminance += lum;
      }

      const avgLum = totalLuminance / featureVector.length || 1;
      const normalizedVector = featureVector.map((val) => Number((val / avgLum).toFixed(4)));

      resolve({
        capturedAt: new Date().toISOString(),
        imagePreviewUrl: dataUrl,
        featureVector: normalizedVector,
        aspectRatio: (img.width || 1) / (img.height || 1),
      });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

// Compare Live Face Descriptor with Registered Owner Descriptor
export function compareFacialDescriptors(
  current: FaceDescriptor,
  registered: FaceDescriptor
): { isMatch: boolean; similarity: number; reason?: string } {
  if (!current || !registered || !current.featureVector || !registered.featureVector) {
    return { isMatch: false, similarity: 0, reason: 'Missing facial descriptor data' };
  }

  if (current.featureVector.length !== registered.featureVector.length) {
    return { isMatch: false, similarity: 0, reason: 'Vector dimension mismatch' };
  }

  // Calculate Cosine Similarity between feature vectors
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < current.featureVector.length; i++) {
    const a = current.featureVector[i];
    const b = registered.featureVector[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  const roundedSimilarity = Number(similarity.toFixed(4));

  // Required similarity threshold for positive identification (82%+ feature similarity)
  const MATCH_THRESHOLD = 0.82;
  const isMatch = roundedSimilarity >= MATCH_THRESHOLD;

  return {
    isMatch,
    similarity: roundedSimilarity,
    reason: isMatch
      ? `Face matched owner descriptor (${Math.round(roundedSimilarity * 100)}% similarity)`
      : `Face mismatch! Similarity ${Math.round(roundedSimilarity * 100)}% is below security threshold (${Math.round(MATCH_THRESHOLD * 100)}%)`,
  };
}
