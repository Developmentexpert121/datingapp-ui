#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import "StreamVideoReactNative.h"
#import "RNSplashScreen.h"
#import <AuthenticationServices/AuthenticationServices.h> // Import for authentication services
#import <SafariServices/SafariServices.h> // Import for Safari services
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
// #import <React/RCTPushNotificationManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"DatingApp";
  // Custom initial props can be added in the dictionary below.
  self.initialProps = @{};
  
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  [StreamVideoReactNative setup];
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen hide];
  return YES;
}

// Uncomment and modify the method below if you need push notifications
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
// {
//   [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
// }

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
