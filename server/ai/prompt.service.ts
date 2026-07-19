import { getSystemPrompt } from '../prompts/system.prompt';
import { navigationPrompt } from '../prompts/navigation.prompt';
import { matchdayPrompt } from '../prompts/matchday.prompt';
import { transportationPrompt } from '../prompts/transportation.prompt';
import { accessibilityPrompt } from '../prompts/accessibility.prompt';
import { emergencyPrompt } from '../prompts/emergency.prompt';

export const assemblePrompt = (message: string, contextData: any) => {
  let systemPrompt = getSystemPrompt(contextData);
  
  // Inject sub-prompts based on simple keyword matching
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('gate') || lowercaseMsg.includes('where is') || lowercaseMsg.includes('navigate')) {
    systemPrompt += '\n' + navigationPrompt;
  }
  
  if (lowercaseMsg.includes('food') || lowercaseMsg.includes('eat') || lowercaseMsg.includes('merch') || lowercaseMsg.includes('buy')) {
    systemPrompt += '\n' + matchdayPrompt;
  }
  
  if (lowercaseMsg.includes('bus') || lowercaseMsg.includes('train') || lowercaseMsg.includes('metro') || lowercaseMsg.includes('park')) {
    systemPrompt += '\n' + transportationPrompt;
  }
  
  if (lowercaseMsg.includes('wheelchair') || lowercaseMsg.includes('access') || lowercaseMsg.includes('blind') || lowercaseMsg.includes('deaf')) {
    systemPrompt += '\n' + accessibilityPrompt;
  }
  
  if (lowercaseMsg.includes('emergency') || lowercaseMsg.includes('hurt') || lowercaseMsg.includes('police') || lowercaseMsg.includes('doctor')) {
    systemPrompt += '\n' + emergencyPrompt;
  }

  return systemPrompt;
};
