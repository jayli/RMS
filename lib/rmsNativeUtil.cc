// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Native utilities.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

#include <v8.h>
#include <node.h>

using namespace node;
using namespace v8;

class RMSNativeUtil: ObjectWrap
{
  private:
    int m_count;

  public:
    static Persistent<FunctionTemplate> s_ct;
    static void Init(Handle<Object> target)
    {
      HandleScope scope;
      NODE_SET_METHOD(target, "forceGC", ForceGC);
    }

    RMSNativeUtil(): m_count(0)
    {
    }

    ~RMSNativeUtil()
    {
    }

    static Handle<Value> ForceGC(const Arguments& args)
    {
      HandleScope scope;
      V8::LowMemoryNotification();
      return Undefined();
    }

};

Persistent<FunctionTemplate> RMSNativeUtil::s_ct;

extern "C" {
  static void init (Handle<Object> target)
  {
    RMSNativeUtil::Init(target);
  }

  NODE_MODULE(rmsNativeUtil, init);
}
